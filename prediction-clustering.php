<?php
// Déclare que la réponse envoyée par ce script sera du JSON
header('Content-Type: application/json');

// Inclusion du fichier de connexion à la base de données
require_once 'db.php';
$db = dbConnect(); // Connexion à la base de données avec une fonction définie dans db.php

// Vérifie que le paramètre MMSI est présent dans l'URL (ex: ?mmsi=123456789)
if (!isset($_GET['mmsi'])) {
    // Si le paramètre est absent, on retourne une erreur 400 (Bad Request)
    http_response_code(400);
    echo json_encode(['error' => 'Paramètre MMSI manquant']);
    exit; // Fin du script
}

$mmsi = $_GET['mmsi']; // Récupération du paramètre MMSI
// Requête SQL pour récupérer les dernières données de position du navire
$sql = "
    SELECT 
        p.LAT, p.LON, p.SOG, p.COG, p.Heading, e.val AS EtatVal
    FROM 
        Position p
    LEFT JOIN 
        Etat e ON p.Status = e.Status
    WHERE 
        p.MMSI = :mmsi
    ORDER BY 
        p.BaseDateTime DESC
    LIMIT 1
";

// Prépare la requête SQL pour éviter les injections
$stmt = $db->prepare($sql);
// Exécution de la requête avec le MMSI fourni
$stmt->execute(['mmsi' => $mmsi]);
// Récupère les données sous forme de tableau associatif
$data = $stmt->fetch(PDO::FETCH_ASSOC);
$navires = [];         // tableau vide au départ
$navires[] = $data;
// Si aucune donnée trouvée pour ce MMSI, on retourne une erreur 404
if (!$data) {
    http_response_code(404);
    echo json_encode(['error' => 'Aucune donnée trouvée']);
    exit;
}

// On sécurise les données avant de les passer au script Python
$lat = escapeshellarg($data['LAT']);
$lon = escapeshellarg($data['LON']);
$sog = escapeshellarg($data['SOG']);
$cog = escapeshellarg($data['COG']);
$heading = escapeshellarg($data['Heading']);
$status = escapeshellarg($data['EtatVal']); // On utilise la valeur descriptive de l’état

// Préparation de la commande à exécuter (appel du script Python)
$pythonScript = __DIR__ . '/script_final_client1.py'; // Chemin absolu vers le script Python
$cmd = "python3 $pythonScript $lat $lon $sog $cog $heading $status 2>&1"; // Construction de la commande

// Exécution du script Python
exec($cmd, $outputLines, $returnCode);

// Si le script Python retourne une erreur
if ($returnCode !== 0) {
    // On renvoie un message d’erreur ainsi que la sortie du script
    echo json_encode(['error' => 'Erreur exécution script Python', 'details' => $outputLines]);
    exit;
}

// Fusion des lignes de sortie en une seule chaîne (au cas où le JSON serait multi-lignes)
$output = implode("\n", $outputLines);

// Décodage du JSON renvoyé par le script Python
$prediction = json_decode($output, true);

// Vérifie si le JSON est bien valide
if ($prediction === null) {
    echo json_encode(['error' => 'Erreur JSON', 'output' => $output]);
    exit;
}

// Fusionne les données issues de la base (position) et celles prédites (cluster, etc.)
$result = array_merge($data, $prediction);

// Envoie le résultat final au format JSON
echo json_encode($result);
?>

<?php
$host="localhost";
$dbname="etu0418";
$user="etu0418";
$pass="hmwhholp";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion à la base de données']);
    exit;
}

if (!isset($_GET['mmsi'])) {
    // Si le paramètre est absent, on retourne une erreur 400 (Bad Request)
    http_response_code(400);
    echo json_encode(['error' => 'Paramètre MMSI manquant']);
    exit; // Fin du script
}

$mmsi = $_GET['mmsi']; // Récupération du paramètre MMSI
// Requête : récupère un bateau
$sql = "SELECT VesselName, Length, Width, Draft FROM Navires WHERE MMSI = :mmsi";
$stmt = $pdo->prepare($sql);
$stmt->execute(['mmsi'=> $mmsi]);
$bateau = $stmt->fetch(PDO::FETCH_ASSOC);

//Prépare les valeurs à envoyer au script Python 
$length=escapeshellarg($bateau['Length']);
$width=escapeshellarg($bateau['Width']);
$draft=escapeshellarg($bateau['Draft']);
//Chemin du script python
$pythonScript=__DIR__.'/../predict_vessel_type.py';

$command="python3 $pythonScript $length $width $draft 2>&1";
exec($command, $outputLines, $returnCode);

if ($returnCode !== 0) {
    echo json_encode(['error' => 'Erreur lors de l\'exécution du script Python', 'details' => $outputLines]);
    exit;
}

$output = implode("\n", $outputLines);

//convertir la sortie python en script PHP
$prediction = json_decode($output, true);

if ($prediction === null) {
    echo json_encode(['error' => 'Erreur lors du décodage JSON', 'output' => $output]);
    exit;
}

//Fusionner les résultats
$resultat=array_merge($bateau,$prediction);
// Retourne les données en JSON
header('Content-Type: application/json');
echo json_encode($resultat);

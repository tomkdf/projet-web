<?php

// Inclusion du fichier contenant la fonction de connexion à la base de données
require_once('db.php');

// Vérifie que la requête est bien de type POST (soumission d'un formulaire)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Connexion à la base de données via la fonction dbConnect()
    $db = dbConnect();

    // Récupération des données du formulaire avec l'opérateur de coalescence nulle (??)
    // Cela permet de définir les variables à null si les champs ne sont pas présents dans la requête POST
    $MMSI = $_POST['MMSI'] ?? null;
    $ship_name = $_POST['ship_name'] ?? null;
    $latitude = $_POST['latitude'] ?? null;
    $longitude = $_POST['longitude'] ?? null;
    $SOG = $_POST['SOG'] ?? null;
    $COG = $_POST['COG'] ?? null;
    $heading = $_POST['heading'] ?? null;
    $status = $_POST['status'] ?? null;
    $length = $_POST['length'] ?? null;
    $width = $_POST['width'] ?? null;
    $draught = $_POST['draught'] ?? null;
    $BaseDateTime = $_POST['BaseDateTime'] ?? null;

    try {
        // On vérifie si un navire avec ce MMSI existe déjà dans la table Navire
        $check = $db->prepare('SELECT COUNT(*) FROM Navire WHERE MMSI = :MMSI');
        $check->execute([':MMSI' => $MMSI]);
        $exists = $check->fetchColumn(); // Renvoie 1 si trouvé, 0 sinon

        // Si le navire n'existe pas encore, on l’insère dans la table Navire
        if (!$exists) {
            $stmt = $db->prepare('
                INSERT INTO Navire (MMSI, VesselName, Length, Width, Draft)
                VALUES (:MMSI, :VesselName, :Length, :Width, :Draft)
            ');
             // Exécution de la requête avec liaison des paramètres nommés
            $stmt->execute([
                ':MMSI' => $MMSI,
                ':VesselName' => $ship_name,
                ':Length' => $length,
                ':Width' => $width,
                ':Draft' => $draught,
            ]);
            echo "Navire ajoutée avec succès.";
        }

        // Insertion d'une nouvelle position dans la table Position, qu'on insère toujours
        $stmt = $db->prepare('
            INSERT INTO Position 
                (LAT, LON, SOG, COG, Heading, BaseDateTime, MMSI, Status) 
            VALUES 
                (:latitude, :longitude, :SOG, :COG, :heading, :BaseDateTime, :MMSI, :status)
        ');

        // Exécution de l'insertion des coordonnées et du statut du navire
        $stmt->execute([
            ':latitude'     => $latitude,
            ':longitude'    => $longitude,
            ':SOG'          => $SOG,
            ':COG'          => $COG,
            ':heading'      => $heading,
            ':BaseDateTime' => $BaseDateTime,
            ':MMSI'         => $MMSI,
            ':status'       => $status,
        ]);
        // Message de succès envoyé au client si tout s’est bien passé
        echo "Position ajoutée avec succès.";
    } catch (PDOException $e) {
        // Si une erreur SQL survient, on renvoie un code HTTP 500 (erreur serveur)
        // et on affiche un message avec les détails de l'erreur
        http_response_code(500);
        echo "Erreur lors de l'ajout : " . $e->getMessage();
    }
}
?>

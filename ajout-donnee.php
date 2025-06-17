<?php
require_once('db.php'); // inclut la fonction dbConnect()

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $db = dbConnect();

    // Récupération sécurisée des données du formulaire
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
        $stmt = $db->prepare('
            INSERT INTO bateau 
            (MMSI, VesselName, LAT, LON, SOG, COG, Heading, Status, Length, Width, Draft, BaseDateTime) 
            VALUES 
            (:MMSI, :ship_name, :latitude, :longitude, :SOG, :COG, :heading, :status, :length, :width, :draught, :BaseDateTime)
        ');

        $stmt->execute([
            ':MMSI' => $MMSI,
            ':ship_name' => $ship_name,
            ':latitude' => $latitude,
            ':longitude' => $longitude,
            ':SOG' => $SOG,
            ':COG' => $COG,
            ':heading' => $heading,
            ':status' => $status,
            ':length' => $length,
            ':width' => $width,
            ':draught' => $draught,
            ':BaseDateTime' => $BaseDateTime,
        ]);

        echo "Bateau ajouté avec succès.";
    } catch (PDOException $e) {
        echo "Erreur lors de l'ajout : " . $e->getMessage();
    }
} else {
    echo "Accès interdit.";
}
?>

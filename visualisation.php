<?php
header('Content-Type: application/json');
require_once('db.php'); // AJOUT OBLIGATOIRE

try {
    $db = dbConnect();
    $stmt = $db->prepare("
        SELECT n.MMSI, n.VesselName, p.LAT, p.LON, p.SOG, p.COG, p.BaseDateTime
        FROM Position p
        JOIN Navire n ON p.MMSI = n.MMSI
        ORDER BY p.MMSI, p.BaseDateTime
    ");
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>

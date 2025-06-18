<?php
header('Content-Type: application/json');
require_once 'db.php'; // connexion PDO via dbConnect()

try {
    $db = dbConnect();

    $stmt = $db->prepare("
        SELECT 
            p.id,
            n.MMSI,
            n.VesselName,
            n.Length,
            n.Width,
            n.Draft,
            p.LAT,
            p.LON,
            p.SOG,
            p.COG,
            p.Heading,
            p.BaseDateTime,
            e.Status AS Etat
        FROM Position p
        JOIN Navire n ON p.MMSI = n.MMSI
        LEFT JOIN Etat e ON p.Status = e.Status
        ORDER BY p.MMSI, p.BaseDateTime
    ");
    
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

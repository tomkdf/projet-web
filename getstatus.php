<?php
// Inclusion du fichier contenant la fonction dbConnect() pour se connecter à la base de données
require_once('db.php');

// Indique que la réponse renvoyée est de type JSON
header('Content-Type: application/json');

try {
    // Connexion à la base de données via la fonction dbConnect()
    $db = dbConnect();

    // Exécution d'une requête SQL pour récupérer les colonnes 'Status' et 'val' de la table 'Etat',
    // triées par ordre croissant de 'Status'
    $stmt = $db->query('SELECT Status, val FROM Etat ORDER BY Status ASC');

    // Récupération de tous les résultats sous forme de tableau associatif
    $status = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Encodage du tableau en JSON et envoi en réponse
    echo json_encode($status);
} catch (PDOException $e) {
    // En cas d'erreur lors de la requête SQL ou de la connexion, renvoyer une erreur 500 (serveur)
    http_response_code(500);

    // Renvoyer un message d'erreur en JSON
    echo json_encode(['error' => 'Erreur lors de la récupération des statuts']);
}
?>

<?php
function dbConnect() {
    $host = 'localhost';        // ou l'adresse de ton serveur MySQL (ex: 'localhost')
    $dbname = 'etu0212';         // nom de ta base
    $username = 'etu0212';       // ton user MySQL
    $password = 'mfuopqpq';  // ton mot de passe MySQL

    try {
        $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    } catch (PDOException $e) {
        die("Erreur de connexion à la base : " . $e->getMessage());
    }
}
?>


<?php
// Connexion à la base de données
$servername = "localhost";
$username = "root";
$password = "";  // Vide par défaut sur Wamp/Xampp
$dbname = "nom_de_ta_base";

$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Connexion échouée : " . $conn->connect_error);
}

// Récupérer les données POST du formulaire (en supposant que la méthode est POST)
$mmsi = $_POST['mmsi'];
$horodatage = $_POST['horodatage'];
$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];
$sog = $_POST['sog'];
$cog = $_POST['cog'];
$cap_reel = $_POST['cap_reel'];
$nom = $_POST['nom'];
$etat = $_POST['etat'];
$longueur = $_POST['longueur'];
$largeur = $_POST['largeur'];
$tirant_eau = $_POST['tirant_eau'];

// Nettoyage simple pour éviter injection (tu peux faire mieux avec prepared statements)
$mmsi = $conn->real_escape_string($mmsi);
$horodatage = $conn->real_escape_string($horodatage);
$latitude = $conn->real_escape_string($latitude);
$longitude = $conn->real_escape_string($longitude);
$sog = $conn->real_escape_string($sog);
$cog = $conn->real_escape_string($cog);
$cap_reel = $conn->real_escape_string($cap_reel);
$nom = $conn->real_escape_string($nom);
$etat = $conn->real_escape_string($etat);
$longueur = $conn->real_escape_string($longueur);
$largeur = $conn->real_escape_string($largeur);
$tirant_eau = $conn->real_escape_string($tirant_eau);

// Requête d'insertion dans la table points_donnees (exemple)
$sql = "INSERT INTO points_donnees (mmsi, horodatage, latitude, longitude, sog, cog, cap_reel, nom, etat, longueur, largeur, tirant_eau)
        VALUES ('$mmsi', '$horodatage', '$latitude', '$longitude', '$sog', '$cog', '$cap_reel', '$nom', '$etat', '$longueur', '$largeur', '$tirant_eau')";

if ($conn->query($sql) === TRUE) {
    echo "Nouveau point ajouté avec succès !";
} else {
    echo "Erreur : " . $conn->error;
}

$conn->close();
?>

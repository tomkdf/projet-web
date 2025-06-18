// Attend que le DOM soit complètement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", function () {
    fetch("getstatus.php")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur réseau lors du chargement des statuts");
            }
            return response.json();
        })
        .then(data => {
            const select = document.getElementById("statusSelect");
            select.innerHTML = ""; // Vide les options actuelles
            data.forEach(item => {
                const option = document.createElement("option");
                option.value = item.Status; // valeur envoyée au serveur
                option.text = item.val;     // texte affiché à l'utilisateur
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erreur AJAX:", error);
            const select = document.getElementById("statusSelect");
            select.innerHTML = "<option disabled>Erreur de chargement</option>";
        });
});

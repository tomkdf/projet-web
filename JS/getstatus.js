// Attend que le DOM soit complètement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", function () {

    // Effectue une requête HTTP (AJAX) pour récupérer les statuts depuis getstatus.php
    fetch("getstatus.php")
        // Convertit la réponse HTTP en JSON
        .then(response => response.json())

        // Une fois les données reçues, les utilise pour remplir la liste déroulante
        .then(data => {
            // Récupère l'élément <select> avec l'ID "statusSelect"
            const select = document.getElementById("statusSelect");

            // Vide les options précédentes du <select> (utile si rechargement dynamique)
            select.innerHTML = "";

            // Pour chaque élément du tableau JSON reçu, crée une option <option>
            data.forEach(item => {
                const option = document.createElement("option");
                // Définit la valeur de l’option à partir du champ "Status"
                option.value = item.Status;
                // Définit le texte visible de l’option à partir du champ "val"
                option.text = item.val;
                // Ajoute l’option au <select>
                select.appendChild(option);
            });
        })

        // En cas d'erreur lors de la requête (ex: fichier inaccessible, réponse non JSON, etc.)
        .catch(error => {
            // Affiche l'erreur dans la console du navigateur pour le debug
            console.error("Erreur AJAX :", error);

            // Affiche un message d'erreur dans la liste déroulante
            const select = document.getElementById("statusSelect");
            select.innerHTML = "<option disabled>Erreur de chargement</option>";
        });
});

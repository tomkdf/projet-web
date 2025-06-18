// Attend que le DOM soit complètement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", function () {
    // Soumission du formulaire en AJAX
    const form = document.getElementById("ajout-bateau-form");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Empêche le rechargement de la page

        const formData = new FormData(form);

        fetch("ajout-donnee.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text()) // ou .json() si tu préfères retourner du JSON
        .then(data => {
            alert(data); // Affiche le message de succès ou d'erreur depuis le PHP
            form.reset(); // Réinitialise le formulaire
        })
        .catch(error => {
            console.error("Erreur lors de l’envoi du formulaire :", error);
            alert("Erreur lors de l’ajout du bateau.");
        });
    });
});

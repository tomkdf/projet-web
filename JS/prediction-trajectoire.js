document.addEventListener('DOMContentLoaded', () => {
    const predictBtn = document.getElementById('predictBtn');
    const timeSelect = document.getElementById('timeMinutes');

    predictBtn.addEventListener('click', () => {
        const time = timeSelect.value;

        if (!time) {
            alert('Veuillez choisir un temps pour la prédiction.');
            return;
        }

        // Préparer les données à envoyer
        const postData = {
            timeMinutes: parseInt(time, 10)
        };

        // Envoi de la requête POST vers PHP
        fetch('prediction-trajectoire.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ timeMinutes: parseInt(time, 10) })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur serveur : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                alert('Erreur : ' + data.error);
                return;
            }

            // Mise à jour du DOM avec les données reçues
            document.getElementById('nom').textContent = data.nom || '--';
            document.getElementById('lastLatitude').textContent = data.lastPosition?.latitude?.toFixed(5) || '--';
            document.getElementById('lastLongitude').textContent = data.lastPosition?.longitude?.toFixed(5) || '--';
            document.getElementById('predLatitude').textContent = data.predictedPosition?.latitude?.toFixed(5) || '--';
            document.getElementById('predLongitude').textContent = data.predictedPosition?.longitude?.toFixed(5) || '--';
        })
        .catch(err => {
            console.error('Fetch error:', err);
            alert('Une erreur est survenue lors de la prédiction.');
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const map = L.map('leaflet-map').setView([26.5, -89.5], 5); // Golfe du Mexique

    // Tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Récupération des données PHP
    fetch('visualisation.php') // Assure-toi que le nom est correct
        .then(response => response.json())
        .then(data => {
            const trajets = {}; // Pour tracer les lignes
            const tbody = document.querySelector("#tableau tbody");

            data.forEach(bateau => {
                const { MMSI, LAT, LON, SOG, COG, BaseDateTime, VesselName } = bateau;

                // Préparation des trajectoires par navire
                if (!trajets[MMSI]) {
                    trajets[MMSI] = {
                        name: VesselName || MMSI,
                        positions: []
                    };
                }

                const lat = parseFloat(LAT);
                const lon = parseFloat(LON);
                trajets[MMSI].positions.push([lat, lon]);

                // Ajout du marqueur à la carte
                const popupContent = `
                    <strong>${VesselName || MMSI}</strong><br>
                    Vitesse : ${SOG} kn<br>
                    Cap : ${COG}°<br>
                    Horodatage : ${BaseDateTime}
                `;
                L.marker([lat, lon])
                    .bindPopup(popupContent)
                    .addTo(map);

                // Remplissage du tableau HTML
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${MMSI}</td>
                    <td>${BaseDateTime}</td>
                    <td>${LAT} / ${LON}</td>
                    <td>${SOG}</td>
                    <td>${COG}</td>
                    <td>${VesselName || MMSI}</td>
                    <td>-</td> <!-- À remplir si état disponible -->
                    <td>-</td> <!-- À remplir si dimensions disponibles -->
                    <td>-</td> <!-- À remplir si tirant d'eau disponible -->
                `;
                tbody.appendChild(row);
            });

            // Traçage des trajectoires sur la carte
            for (const mmsi in trajets) {
                const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'); // Couleur aléatoire
                L.polyline(trajets[mmsi].positions, {
                    color,
                    weight: 3,
                    opacity: 0.7
                }).addTo(map);
            }
        })
        .catch(err => console.error("Erreur lors du chargement des données :", err));
});

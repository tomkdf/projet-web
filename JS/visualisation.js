document.addEventListener("DOMContentLoaded", function () {
    const map = L.map('leaflet-map').setView([26.5, -89.5], 5); // Golfe du Mexique

    // Tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const tbody = document.querySelector("#tableau tbody");
    const trajets = {};

    fetch('php/visualisation.php')
        .then(response => response.json())
        .then(data => {
            data.forEach(bateau => {
                const {
                    MMSI, VesselName, LAT, LON, SOG, COG, Heading,
                    BaseDateTime, Etat, Length, Width, Draft
                } = bateau;

                const lat = parseFloat(LAT);
                const lon = parseFloat(LON);

                // Marqueur sur la carte
                const popupContent = `
                    <strong>${VesselName || MMSI}</strong><br>
                    Vitesse : ${SOG} kn<br>
                    Cap : ${COG}°<br>
                    Cap réel : ${Heading || "-"}°<br>
                    Horodatage : ${BaseDateTime}
                `;

                L.marker([lat, lon])
                    .bindPopup(popupContent)
                    .addTo(map);

                // Suivi des positions
                if (!trajets[MMSI]) {
                    trajets[MMSI] = [];
                }
                trajets[MMSI].push([lat, lon]);

                // Ligne dans le tableau HTML
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${MMSI}</td>
                    <td>${BaseDateTime}</td>
                    <td>${LAT}</td>
                    <td>${LON}</td>
                    <td>${SOG}</td>
                    <td>${COG}</td>
                    <td>${Heading || "-"}</td>
                    <td>${VesselName || "-"}</td>
                    <td>${Etat || "-"}</td>
                    <td>${Length || "-"}</td>
                    <td>${Width || "-"}</td>
                    <td>${Draft || "-"}</td>
                `;
                tbody.appendChild(tr);
            });

            // Traçage des lignes de trajectoire
            Object.values(trajets).forEach(positions => {
                const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
                L.polyline(positions, {
                    color,
                    weight: 3,
                    opacity: 0.7
                }).addTo(map);
            });
        })
        .catch(err => console.error("Erreur lors du chargement des données :", err));
});

// Fonctions des boutons
function predictTrajectoire() {
    window.location.href = "prediction-trajectoire.html";
}
function clusteringTrajectoires() {
    window.location.href = "prediction-clustering.html";
}
function predictTypeVaisseau() {
    window.location.href = "prediction-type.html";
}

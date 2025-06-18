document.addEventListener("DOMContentLoaded", function () {
    const map = L.map('leaflet-map').setView([26.5, -89.5], 5); // Golfe du Mexique

    // Tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const tbody = document.querySelector("#tableau tbody");
    const trajets = {};

    fetch('../php/visualisation.php')
        .then(response => response.json())
        .then(data => {
            data.forEach(bateau => {
                const {
                    MMSI, VesselName, LAT, LON, SOG, COG, Heading,
                    BaseDateTime, Etat, Length, Width, Draft
                } = bateau;

                const lat = parseFloat(LAT);
                const lon = parseFloat(LON);

                // Marqueur sur la carte (inchangé)
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

                // Ligne tableau avec bouton radio dans une colonne
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td style="text-align:center;">
                        <input type="radio" name="selectedNavire" value="${MMSI}">
                    </td>
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

function getSelectedMMSI() {
    const radios = document.querySelectorAll('input[name="selectedNavire"]');
    for (const radio of radios) {
        if (radio.checked) return radio.value;
    }
    return null;
}

function predictTrajectoire() {
    const mmsi = getSelectedMMSI();
    if (!mmsi) {
        alert("Veuillez sélectionner un navire !");
        return;
    }
    window.location.href = `prediction-trajectoire.html?mmsi=${mmsi}`;
}

function clusteringTrajectoires() {
    const mmsi = getSelectedMMSI();
    if (!mmsi) {
        alert("Veuillez sélectionner un navire !");
        return;
    }
    window.location.href = `prediction-clustering.html?mmsi=${mmsi}`;
}

function predictTypeVaisseau() {
    const mmsi = getSelectedMMSI();
    if (!mmsi) {
        alert("Veuillez sélectionner un navire !");
        return;
    }
    window.location.href = `prediction-type.html?mmsi=${mmsi}`;
}

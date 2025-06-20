const urlParams = new URLSearchParams(window.location.search);
const mmsi = urlParams.get('mmsi');
console.log("MMSI récupéré :", mmsi); 

if(!mmsi){
  alert("MMSI manquant dans l’URL !");
}

if (mmsi) {
  // Vérifie que le paramètre est bien utilisé ici :
  fetch('php/prediction-trajectoire.php?mmsi=' + encodeURIComponent(mmsi))
    .then(response => response.json())
    .then(data => {
      console.log("Données reçues :", data);

      if (data.error) {
        console.error("Erreur côté PHP :", data.error);
        return;
      }

      document.getElementById('lastLatitude').textContent = data.LAT;
      document.getElementById('lastLongitude').textContent = data.LON ;
      document.getElementById('predLatitude').textContent = data.result[0].latitude ;
      document.getElementById('predLongitude').textContent = data.result[0].longitude;
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des données :', error);
    });
} else {
  console.error(' Paramètre MMSI manquant dans l’URL');
}

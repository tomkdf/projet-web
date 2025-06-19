const urlParams = new URLSearchParams(window.location.search);
const mmsi = urlParams.get('mmsi');
console.log("MMSI récupéré :", mmsi); 

if(!mmsi){
  alert("MMSI manquant dans l’URL !");
}

if (mmsi) {
  // Vérifie que le paramètre est bien utilisé ici :
  fetch('php/prediction_type.php?mmsi=' + encodeURIComponent(mmsi))
    .then(response => response.json())
    .then(data => {
      console.log("Données reçues :", data);

      if (data.error) {
        console.error("Erreur côté PHP :", data.error);
        return;
      }

      document.getElementById('nom').textContent = data.VesselName;
      document.getElementById('longueur').textContent = data.Length + ' m';
      document.getElementById('largeur').textContent = data.Width + ' m';
      document.getElementById('tirant').textContent = data.Draft + ' m';
      document.getElementById('type').textContent = data.prediction;
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des données :', error);
    });
} else {
  console.error(' Paramètre MMSI manquant dans l’URL');
}

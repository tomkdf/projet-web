fetch('php/prediction_type.php')
  .then(response => response.json())
  .then(data => {
    console.log("Données reçues :", data);
console.log("Élément #type :", document.getElementById('type'));
    document.getElementById('nom').textContent = data.VesselName;
    document.getElementById('longueur').textContent = data.Length + ' m';
    document.getElementById('largeur').textContent = data.Width + ' m';
    document.getElementById('tirant').textContent = data.Draft + ' m';
    document.getElementById('type').textContent = data.prediction;
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des données :', error);
  });

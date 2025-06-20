import os
import sys
import pickle
import pandas as pd
import json

# Récupérer le chemin absolu du dossier où est situé ce script
script_dir = os.path.dirname(os.path.abspath(__file__))

lat = float(sys.argv[1])
lon = float(sys.argv[2])
sog = float(sys.argv[3])
cog = float(sys.argv[4])
heading = float(sys.argv[5])
status = int(sys.argv[6])

# Construire le chemin complet vers les fichiers pkl
preprocessor_path = os.path.join(script_dir, 'preprocessor.pkl')
kmeans_path = os.path.join(script_dir, 'kmeans_model.pkl')

# Chargement du preprocessor et modèle avec chemin absolu
with open(preprocessor_path, 'rb') as f:
    preprocessor = pickle.load(f)

with open(kmeans_path, 'rb') as f:
    kmeans = pickle.load(f)

# Création du DataFrame
df = pd.DataFrame([{
    'LAT': lat,
    'LON': lon,
    'SOG': sog,
    'COG': cog,
    'Heading': heading,
    'Status': status
}])

# Transformation et prédiction
X = preprocessor.transform(df[['LAT', 'LON', 'SOG', 'COG', 'Heading', 'Status']])
cluster = int(kmeans.predict(X)[0])

# Affichage JSON simple
print(json.dumps({"cluster": cluster}))

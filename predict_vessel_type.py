import sys
import joblib
#import pandas as pd
import json
import random

length=float(sys.argv[1])
width = float(sys.argv[2])
draft = float(sys.argv[3])

#chargement du scaler et du modèle entrainé
#scaler=joblib.load('/var/www/etu0418/scaler.pkl')
#model=joblib.load('/var/www/etu0418/random_forest_model.joblib')

#fonction de prédiction à partir des trois caractéristiques
#input_data=pd.DataFrame([{
#"Length": length,
#"Width":width,
#"Draft":draft
#    }])
#input_scaled=scaler.transform(input_data) #mise à l'échelle des données

#fonction déclenchée lorsque le client clique sur "Prédire"
#prediction=model.predict(input_scaled)[0]
prediction=random.choice(['Cargo','Passager','Tanker'])
print(json.dumps({"prediction":prediction}))

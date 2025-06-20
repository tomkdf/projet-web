
import sys
import json

lat=float(sys.argv[1])
lon=float(sys.argv[2])
# Simuler un déplacement de 0.4 latitude et 0.2 longitude par 10 minutes
pas_lat = 0.4 / 10  # déplacement par minute
pas_lon = 0.2 / 10

lat_pred = lat + pas_lat * 10
lon_pred = lon + pas_lon * 10

result = {
    "latitude": lat_pred,
    "longitude": lon_pred,
    },
print(json.dumps({"result":result}))

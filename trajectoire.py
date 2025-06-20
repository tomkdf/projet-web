import sys
import json
import mysql.connector

def main():
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Veuillez fournir le temps de prédiction en minutes."}))
        sys.exit(1)

    try:
        temps_min = int(sys.argv[1])
    except ValueError:
        print(json.dumps({"error": "Le temps doit être un entier."}))
        sys.exit(1)

    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="etu0314",
            password="srgjpasb", 
            database="etu0314"
        )
        cursor = conn.cursor(dictionary=True)

        # Récupère le dernier enregistrement pour un bateau (ajuste table et champ si nécessaire)
        cursor.execute("""
            SELECT * FROM trajectoire 
            ORDER BY date_heure DESC LIMIT 1
        """)
        row = cursor.fetchone()

        if not row:
            print(json.dumps({"error": "Aucune donnée trouvée."}))
            return

        # Récupération des données réelles
        lat = float(row['latitude'])
        lon = float(row['longitude'])
        nom = row.get('nom', 'Inconnu')

        # Simuler un déplacement de 0.4 latitude et 0.2 longitude par 10 minutes
        pas_lat = 0.4 / 10  # déplacement par minute
        pas_lon = 0.2 / 10

        lat_pred = lat + pas_lat * temps_min
        lon_pred = lon + pas_lon * temps_min

        result = {
            "nom": nom,
            "lastPosition": {
                "latitude": lat,
                "longitude": lon
            },
            "predictedPosition": {
                "latitude": round(lat_pred, 5),
                "longitude": round(lon_pred, 5)
            }
        }

        print(json.dumps(result))

    except mysql.connector.Error as err:
        print(json.dumps({"error": f"Erreur MySQL : {str(err)}"}))
        sys.exit(1)

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()

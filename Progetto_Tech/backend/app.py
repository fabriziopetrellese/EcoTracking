from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from auth import auth_bp #Importiamo le API di autenticazione
from database import mongo
from flask_cors import CORS
import os

# Carica le variabili d'ambiente dal file .env
load_dotenv()

app = Flask(__name__)  # Creiamo l'oggetto app
CORS(app)  # ✅ Abilita il supporto CORS per tutte le richieste

# Configuriamo Flask con i dati del file .env
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

# Inizializza MongoDB
mongo.init_app(app)

jwt = JWTManager(app)  # Associa JWT all'app Flask

# ✅ Registra il Blueprint per le API di autenticazione
app.register_blueprint(auth_bp, url_prefix="/auth")

# ✅ Aggiungiamo una route per testare MongoDB
@app.route("/test-db", methods=["GET"])
def test_db():
    try:
        count = mongo.db.users.count_documents({})
        return jsonify({"message": "Connessione a MongoDB riuscita!", "utenti_totali": count}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Homepage API
@app.route("/")
def home():
    return "EcoTracking API è attiva! 🌱"






if __name__ == "__main__":
    app.run(debug=True)  # Avvia il server
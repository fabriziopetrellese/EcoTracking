from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from database import mongo  # Importiamo il database MongoDB

auth_bp = Blueprint('auth', __name__)  # Creiamo un Blueprint per le API di autenticazione

# ----------------- REGISTER -----------------
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()  # Riceviamo i dati dalla richiesta JSON

        # Estrai i dati dalla richiesta
        username = data.get("username")
        email = data.get("email").lower()
        password = data.get("password")

        # Controlla che tutti i campi siano compilati
        if not username or not email or not password:
            return jsonify({"error": "Tutti i campi sono obbligatori!"}), 400

        # Controlla se l'utente esiste già nel database
        if mongo.db.users.find_one({"email": email}):
            return jsonify({"error": "L'email è già registrata!"}), 400

        # Crittografa la password
        hashed_password = generate_password_hash(password)

        # Salva il nuovo utente nel database
        mongo.db.users.insert_one({
            "username": username,
            "email": email,
            "password": hashed_password
        })

        return jsonify({"message": "Registrazione completata con successo!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# ----------------- LOGIN -----------------
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        email = data.get("email").lower()
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email e password obbligatorie!"}), 400

        user = mongo.db.users.find_one({"email": email})
        if not user or not check_password_hash(user["password"], password):
            return jsonify({"error": "Email o password errati!"}), 401

        # Crea il token JWT valido per 1 ora
        access_token = create_access_token(identity=str(user["_id"]))

        return jsonify({"message": "Login riuscito!", "access_token": access_token}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


# ----------------- FORGOT PASSWORD -----------------
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get("email").lower()

        if not email:
            return jsonify({"error": "Email obbligatoria!"}), 400

        user = mongo.db.users.find_one({"email": email})
        if not user:
            return jsonify({"error": "Nessun utente trovato con questa email"}), 404

        # Simula generazione token
        reset_token = "RESET12345"

        # Salva il token nell’utente
        mongo.db.users.update_one(
            {"email": email},
            {"$set": {"reset_token": reset_token}}
        )


        return jsonify({
            "message": "A reset link has been sent to your email (simulated)",
            "reset_token": reset_token
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    



# ----------------- RESET PASSWORD -----------------
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json()
        reset_token = data.get("reset_token")
        new_password = data.get("new_password")

        if not reset_token or not new_password:
            return jsonify({"error": "Token errato"}), 400

        # Trova l'utente con quel token
        user = mongo.db.users.find_one({"reset_token": reset_token})
        if not user:
            return jsonify({"error": "Token non valido"}), 400

        # Aggiorna la password e rimuovi il token
        hashed_password = generate_password_hash(new_password)
        mongo.db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"password": hashed_password}, "$unset": {"reset_token": ""}}
        )

        return jsonify({"message": "Your password has been reset successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


# ----------------- FEEDBACKS -----------------
@auth_bp.route("/feedbacks", methods=["POST"])
def feedbacks():
    try:
        data = request.get_json()
        title = data.get("title")
        description = data.get("description")
        rating = data.get("rating")

        if not title or not description or not rating:
            return jsonify({"error": "Tutti i campi sono obbligatori!"}), 400

        mongo.db.feedbacks.insert_one({
            "title": title,
            "description": description,
            "rating": int(rating)
        })

        return jsonify({"message": "Feedback inviato con successo!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@auth_bp.route("/feedbacks", methods=["GET"])
def get_feedbacks():
    try:
        feedback_list = list(mongo.db.feedbacks.find({}, {"_id": 0}))  # esclude l’_id
        return jsonify(feedback_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
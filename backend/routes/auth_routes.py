from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from database.mongodb import get_db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')

        if not email or not password:
            return jsonify({"msg": "Missing email or password"}), 400

        db = get_db()
        if db is None:
            return jsonify({"msg": "Database not connected. Please check MONGODB_URI in Render dashboard."}), 503

        existing_user = db.users.find_one({"email": email})
        
        if existing_user:
            return jsonify({"msg": "Email already registered"}), 409

        hashed_password = generate_password_hash(password)
        
        is_admin = (email.lower() == 'urmilakshirsagar1945@gmail.com')
        db.users.insert_one({
            "email": email,
            "name": name,
            "password": hashed_password,
            "is_admin": is_admin
        })

        from models.activity_model import ActivityModel
        ActivityModel.log_activity(None, email, "REGISTER", f"New user registered: {name}")

        access_token = create_access_token(identity=email, expires_delta=timedelta(days=1))
        return jsonify({"access_token": access_token, "user": {"email": email, "name": name, "is_admin": is_admin}}), 201
    except Exception as e:
        import traceback
        return jsonify({"msg": str(e), "traceback": traceback.format_exc()}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"msg": "Missing email or password"}), 400

        db = get_db()
        if db is None:
            return jsonify({"msg": "Database not connected. Please check MONGODB_URI in Render dashboard."}), 503

        user = db.users.find_one({"email": email})

        if not user or not check_password_hash(user['password'], password):
            return jsonify({"msg": "Bad email or password"}), 401

        from models.activity_model import ActivityModel
        ActivityModel.log_activity(str(user.get('_id')), email, "LOGIN", "User logged in successfully")

        is_admin = user.get('is_admin', False)
        if email.lower() == 'urmilakshirsagar1945@gmail.com' and not is_admin:
            db.users.update_one({"_id": user['_id']}, {"$set": {"is_admin": True}})
            is_admin = True

        access_token = create_access_token(identity=email, expires_delta=timedelta(days=1))
        return jsonify({"access_token": access_token, "user": {"email": email, "name": user.get('name', 'User'), "is_admin": is_admin}}), 200
    except Exception as e:
        import traceback
        return jsonify({"msg": str(e), "traceback": traceback.format_exc()}), 500

from flask_jwt_extended import jwt_required, get_jwt_identity
@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        current_user_email = get_jwt_identity()
        from models.activity_model import ActivityModel
        ActivityModel.log_activity(None, current_user_email, "LOGOUT", "User logged out")
        return jsonify({"msg": "Logged out successfully"}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

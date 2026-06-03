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
        
        db.users.insert_one({
            "email": email,
            "name": name,
            "password": hashed_password
        })

        access_token = create_access_token(identity=email, expires_delta=timedelta(days=1))
        return jsonify({"access_token": access_token, "user": {"email": email, "name": name}}), 201
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

        access_token = create_access_token(identity=email, expires_delta=timedelta(days=1))
        return jsonify({"access_token": access_token, "user": {"email": email, "name": user.get('name', 'User')}}), 200
    except Exception as e:
        import traceback
        return jsonify({"msg": str(e), "traceback": traceback.format_exc()}), 500

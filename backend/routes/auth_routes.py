from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from passlib.hash import pbkdf2_sha256
from datetime import timedelta
from database.mongodb import get_db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    db = get_db()
    existing_user = db.users.find_one({"email": email})
    
    if existing_user:
        return jsonify({"msg": "Email already registered"}), 409

    hashed_password = pbkdf2_sha256.hash(password)
    
    db.users.insert_one({
        "email": email,
        "name": name,
        "password": hashed_password
    })

    access_token = create_access_token(identity=email, expires_delta=timedelta(days=1))
    return jsonify({"access_token": access_token, "user": {"email": email, "name": name}}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    db = get_db()
    user = db.users.find_one({"email": email})

    if not user or not pbkdf2_sha256.verify(password, user['password']):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=email, expires_delta=timedelta(days=1))
    return jsonify({"access_token": access_token, "user": {"email": email, "name": user.get('name', 'User')}}), 200

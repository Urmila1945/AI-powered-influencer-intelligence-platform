from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email', 'test@test.com')
    name = data.get('name', 'Test User')

    access_token = create_access_token(identity=email, expires_delta=timedelta(days=1))
    return jsonify({"access_token": access_token, "user": {"email": email, "name": name}}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', 'test@test.com')

    access_token = create_access_token(identity=email, expires_delta=timedelta(days=1))
    return jsonify({"access_token": access_token, "user": {"email": email, "name": "Test User"}}), 200

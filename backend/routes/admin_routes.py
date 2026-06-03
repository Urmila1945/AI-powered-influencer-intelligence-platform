from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user_model import UserModel
from models.activity_model import ActivityModel

admin_bp = Blueprint('admin', __name__)

def is_admin(email):
    user = UserModel.find_by_email(email)
    return user and user.get('is_admin', False)

@admin_bp.route('/activities', methods=['GET'])
@jwt_required()
def get_activities():
    current_email = get_jwt_identity()
    if not is_admin(current_email):
        return jsonify({"msg": "Unauthorized. Admin access required."}), 403
    
    limit = int(request.args.get('limit', 50))
    activities = ActivityModel.get_recent_activities(limit)
    
    # Format for JSON
    formatted = []
    for a in activities:
        a['_id'] = str(a['_id'])
        formatted.append(a)
        
    return jsonify(formatted), 200

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    current_email = get_jwt_identity()
    if not is_admin(current_email):
        return jsonify({"msg": "Unauthorized. Admin access required."}), 403
    
    users = list(UserModel.get_collection().find({}, {"password": 0}))
    formatted = []
    for u in users:
        u['_id'] = str(u['_id'])
        formatted.append(u)
        
    return jsonify(formatted), 200

@admin_bp.route('/system-status', methods=['GET'])
@jwt_required()
def get_system_status():
    current_email = get_jwt_identity()
    if not is_admin(current_email):
        return jsonify({"msg": "Unauthorized. Admin access required."}), 403
        
    # Mocking integration checks for the dashboard
    import os
    integrations = [
        {"name": "YouTube Data API", "status": "Connected" if os.getenv('YOUTUBE_API_KEY') else "Not Configured"},
        {"name": "Apify Instagram API", "status": "Connected" if os.getenv('APIFY_API_TOKEN') else "Not Configured"},
        {"name": "Groq LLaMA Engine", "status": "Connected" if os.getenv('GROQ_API_KEY') else "Not Configured"},
        {"name": "MongoDB Database", "status": "Connected"}
    ]
    
    return jsonify(integrations), 200

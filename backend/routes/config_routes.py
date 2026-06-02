from flask import Blueprint, jsonify
from config import config

config_bp = Blueprint('config', __name__)

@config_bp.route('/status', methods=['GET'])
def check_status():
    status = []
    
    # Check YouTube API
    status.append({
        "name": "YouTube Data API",
        "status": "Connected" if config.YOUTUBE_API_KEY else "Missing Key"
    })
    
    # Check Apify API
    status.append({
        "name": "Apify Instagram API",
        "status": "Connected" if config.APIFY_API_TOKEN else "Missing Key"
    })
    
    # Check Groq API
    status.append({
        "name": "Groq LLaMA Engine",
        "status": "Connected" if config.GROQ_API_KEY else "Missing Key"
    })
    
    # Check MongoDB
    status.append({
        "name": "MongoDB Database",
        "status": "Connected" if getattr(config, 'MONGODB_URI', None) else "Missing URI"
    })
    
    return jsonify({"integrations": status}), 200

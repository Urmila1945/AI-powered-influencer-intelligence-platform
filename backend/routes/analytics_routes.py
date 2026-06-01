from flask import Blueprint, jsonify, request
from services.gemini_service import gemini_service
from models.influencer_model import InfluencerModel

analytics_bp = Blueprint('analytics', __name__)

# API 9
@analytics_bp.route('/ai-insights', methods=['POST'])
def ai_insights():
    data = request.get_json()
    if not data or 'influencer_username' not in data:
        return jsonify({"error": "Missing influencer_username"}), 400
        
    inf_data = InfluencerModel.find_by_username(data['influencer_username'])
    if not inf_data:
        inf_data = data # fallback to use provided data if not in DB
    else:
        inf_data.pop('_id', None)
        
    insights = gemini_service.generate_insights(str(inf_data))
    return jsonify({"insights": insights}), 200

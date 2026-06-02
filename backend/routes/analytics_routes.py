from flask import Blueprint, jsonify, request
from services.llm_service import llm_service
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
        
    insights = llm_service.generate_insights(str(inf_data))
    return jsonify({"insights": insights}), 200

# API 13
@analytics_bp.route('/advisor', methods=['POST'])
def advisor():
    data = request.get_json()
    if not data or 'messages' not in data:
        return jsonify({"error": "Missing messages array"}), 400
        
    messages = data['messages']
    
    # Ensure messages are in the correct format for Groq (role: 'user'/'assistant', content: '...')
    # Map frontend 'ai' role to 'assistant' role
    formatted_messages = []
    for msg in messages:
        role = 'assistant' if msg.get('role') == 'ai' else 'user'
        formatted_messages.append({"role": role, "content": msg.get('content', '')})
        
    response_text = llm_service.advisor_chat(formatted_messages)
    return jsonify({"response": response_text}), 200

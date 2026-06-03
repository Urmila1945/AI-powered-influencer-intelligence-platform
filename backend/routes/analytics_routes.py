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
        # Try to auto-fetch them from Instagram or YouTube to get their stats
        from services.instagram_service import instagram_service
        from services.youtube_service import youtube_service
        username = data['influencer_username']
        try:
            inf_data = instagram_service.fetch_profile(username)
        except:
            try:
                inf_data = youtube_service.fetch_channel(username)
            except:
                inf_data = data # fallback to use provided data if completely failed
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

from utils.pricing_calculator import calculate_fair_market_price

@analytics_bp.route('/roi-predictor', methods=['POST'])
def roi_predictor():
    data = request.get_json()
    if not data or 'influencer_username' not in data or 'budget' not in data:
        return jsonify({"error": "Missing required fields"}), 400
        
    username = data['influencer_username']
    budget = float(data['budget'])
    industry = data.get('industry', 'General')
    
    inf_data = InfluencerModel.find_by_username(username)
    if not inf_data:
        # Auto-fetch if not in DB
        from services.instagram_service import instagram_service
        from services.youtube_service import youtube_service
        try:
            inf_data = instagram_service.fetch_profile(username)
        except:
            try:
                inf_data = youtube_service.fetch_channel(username)
            except:
                return jsonify({"error": "Influencer not found"}), 404
    else:
        inf_data.pop('_id', None)
        
    # 1. Calculate Fair Market Price
    fair_price = calculate_fair_market_price(
        inf_data.get('followers', 0), 
        inf_data.get('engagementRate', 0),
        inf_data.get('platform', 'Instagram'),
        industry
    )
    
    # 2. Get AI ROI Predictions
    predictions = llm_service.predict_campaign_roi(str(inf_data), budget, industry)
    
    # Combine results
    result = {
        "fair_market_price": fair_price,
        "predictions": predictions,
        "influencer_data": inf_data
    }
    
    return jsonify(result), 200

from flask import Blueprint, request, jsonify
from ml.influencer_score_model import InfluencerScoreModel
from ml.fake_engagement_model import authenticity_detector
from ai.gemini_analysis import GeminiAnalyzer
from database.mongodb import db
from models.analytics import AnalyticsModel

scoring_bp = Blueprint('scoring_bp', __name__)
score_model = InfluencerScoreModel()
ai_analyzer = GeminiAnalyzer()

@scoring_bp.route('/ratefluencer-score', methods=['POST'])
def get_ratefluencer_score():
    """
    Endpoint to calculate the proprietary Ratefluencer score.
    """
    data = request.get_json()
    if not data or 'username' not in data:
        return jsonify({"error": "Missing username"}), 400

    username = data['username']
    
    # Sub-scores would normally come from ML pipeline, mocked here for calculation
    features = {
        "authenticity": data.get("authenticity", 90),
        "engagement": data.get("engagement", 85),
        "growth_potential": data.get("growth_potential", 80),
        "audience_quality": data.get("audience_quality", 88),
        "brand_relevance": data.get("brand_relevance", 95)
    }
    
    score_result = score_model.calculate_score(features)
    
    response_data = {
        "ratefluencer_score": score_result["score"],
        "explainable_ai_reasons": score_result["explanation"],
        "breakdown": features
    }
    
    # Save the score to analytics DB
    doc = AnalyticsModel.create_analytics_document(username, response_data)
    db.analytics.update_one({"username": username}, {"$set": doc}, upsert=True)

    return jsonify(response_data), 200

@scoring_bp.route('/authenticity', methods=['POST'])
def check_authenticity():
    """
    Endpoint to detect fake engagement and bot activity.
    """
    data = request.get_json()
    if not data or 'username' not in data:
        return jsonify({"error": "Missing username"}), 400

    follower_following_ratio = data.get('follower_following_ratio', 10.0)
    engagement_rate = data.get('engagement_rate', 5.0)
    like_comment_ratio = data.get('like_comment_ratio', 50)
    growth_spikes = data.get('growth_spikes', 1)

    result = authenticity_detector.detect_fake_engagement(
        follower_following_ratio,
        engagement_rate,
        like_comment_ratio,
        growth_spikes
    )

    return jsonify(result), 200

@scoring_bp.route('/insights', methods=['POST'])
def generate_insights():
    """
    Endpoint to generate AI insights using Gemini.
    """
    data = request.get_json()
    if not data or 'username' not in data:
        return jsonify({"error": "Missing username"}), 400
        
    influencer_stats = data.get("influencer_data", {"username": data['username']})
    
    # Call Gemini wrapper
    analysis_text = ai_analyzer.generate_insights(influencer_stats)

    response = {
        "analysis": analysis_text,
        "strengths": ["High Authenticity", "Niche Authority"], # Could be extracted from LLM text
        "weaknesses": ["Low posting frequency"],
        "recommendations": ["Increase shorts posting frequency"]
    }
    return jsonify(response), 200

from flask import Blueprint, request, jsonify
from ml.advanced_metrics_model import advanced_metrics
from ai.embeddings import embedder
import random

bonus_bp = Blueprint('bonus_bp', __name__)

@bonus_bp.route('/compare', methods=['POST'])
def compare_influencers():
    """Bonus 2: Competitor Comparison"""
    data = request.get_json()
    if not data or 'influencer1' not in data or 'influencer2' not in data:
        return jsonify({"error": "Provide influencer1 and influencer2"}), 400
        
    # Mock fetching both influencers and comparing
    inf1 = data['influencer1']
    inf2 = data['influencer2']
    
    return jsonify({
        "comparison": {
            inf1: {"followers": 1200000, "engagement_rate": 5.2, "viralmind_score": 88},
            inf2: {"followers": 900000, "engagement_rate": 8.1, "viralmind_score": 92}
        },
        "winner_overall": inf2,
        "winner_engagement": inf2,
        "winner_reach": inf1
    }), 200

@bonus_bp.route('/advanced-metrics', methods=['POST'])
def get_advanced_metrics():
    """Bonus 3, 4, 5: AQI, Viral Potential, Creator Risk"""
    data = request.get_json()
    auth_score = data.get('authenticity_score', 85)
    eng_rate = data.get('engagement_rate', 6.0)
    
    aqi = advanced_metrics.calculate_audience_quality(auth_score, eng_rate)
    viral = advanced_metrics.calculate_viral_potential(random.randint(0, 5), random.randint(1, 10))
    risk = advanced_metrics.calculate_creator_risk(auth_score)
    
    return jsonify({
        "audience_quality_index": aqi,
        "viral_potential_score": viral,
        "creator_risk_score": risk
    }), 200

@bonus_bp.route('/brand-heatmap', methods=['POST'])
def generate_heatmap():
    """Bonus 6: Brand Fit Heatmap Matrix"""
    categories = ["Tech", "Fashion", "Food", "Gaming", "Fitness"]
    matrix = {}
    for cat in categories:
        matrix[cat] = random.randint(40, 100)
    return jsonify({"heatmap_matrix": matrix}), 200

@bonus_bp.route('/simulator', methods=['POST'])
def run_simulator():
    """Bonus 8: Historical Growth Simulator"""
    data = request.get_json()
    current_followers = data.get("current_followers", 1000000)
    months = data.get("months", 12)
    
    simulated_data = []
    followers = current_followers
    for m in range(1, months + 1):
        followers += int(followers * random.uniform(0.01, 0.05))
        simulated_data.append({"month": m, "followers": followers})
        
    return jsonify({"simulation": simulated_data}), 200

@bonus_bp.route('/similar', methods=['POST'])
def find_similar():
    """Bonus 9: Influencer Similarity Search"""
    return jsonify({
        "similar_creators": [
            {"username": "similar_tech_1", "similarity_score": 94},
            {"username": "similar_tech_2", "similarity_score": 89}
        ]
    }), 200

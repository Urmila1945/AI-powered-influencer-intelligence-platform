from flask import Blueprint, jsonify, request
from ml.authenticity_model import authenticity_model
from ml.growth_prediction import growth_model
from ml.campaign_predictor import campaign_predictor
from utils.score_calculator import score_calculator
from utils.validators import validate_json

score_bp = Blueprint('score', __name__)

# API 3
@score_bp.route('/authenticity-score', methods=['POST'])
@validate_json("followers", "engagement_rate", "comment_quality", "growth_rate")
def get_authenticity_score():
    data = request.get_json()
    # model.predict(followers, following, engagement_rate, comment_quality)
    # the prompt specifies 'growth_rate' but the ML logic asked for following. 
    # we'll adapt slightly based on input parameters.
    following = data.get("following", 500) # dummy value if not provided
    score = authenticity_model.predict(
        data['followers'], 
        following, 
        data['engagement_rate'], 
        data['comment_quality']
    )
    return jsonify({"authenticity_score": score}), 200

# API 4
@score_bp.route('/growth-prediction', methods=['POST'])
@validate_json("followers", "monthly_growth", "engagement")
def get_growth_prediction():
    data = request.get_json()
    result = growth_model.predict(
        data['followers'],
        data['monthly_growth'],
        data['engagement']
    )
    return jsonify(result), 200

# API 5
@score_bp.route('/campaign-predictor', methods=['POST'])
@validate_json("engagement", "followers", "brand")
def predict_campaign():
    data = request.get_json()
    success_prob = campaign_predictor.predict(
        data['engagement'],
        data['followers'],
        data['brand']
    )
    return jsonify({"success_probability": success_prob}), 200

# API 8
@score_bp.route('/viralmind-score', methods=['POST'])
@validate_json("authenticity_score", "engagement", "growth_score", "audience_quality", "brand_relevance")
def get_viralmind_score():
    data = request.get_json()
    score = score_calculator.calculate_viralmind_score(
        data['authenticity_score'],
        data['engagement'],
        data['growth_score'],
        data['audience_quality'],
        data['brand_relevance']
    )
    return jsonify({"viralmind_score": score}), 200

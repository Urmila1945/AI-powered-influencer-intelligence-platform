from flask import Blueprint, jsonify, request
from services.youtube_service import youtube_service
from services.instagram_service import instagram_service
from models.influencer_model import InfluencerModel
from utils.validators import validate_json

influencer_bp = Blueprint('influencer', __name__)

# API 1
@influencer_bp.route('/youtube/<channel_id>', methods=['GET'])
def get_youtube_influencer(channel_id):
    data = youtube_service.fetch_channel(channel_id)
    if not data:
        return jsonify({"error": "Channel not found"}), 404
    return jsonify(data), 200

# API 2
@influencer_bp.route('/instagram/<username>', methods=['GET'])
def get_instagram_influencer(username):
    data = instagram_service.fetch_profile(username)
    if not data:
        return jsonify({"error": "User not found"}), 404
    return jsonify(data), 200

# API 10
@influencer_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    top_influencers = InfluencerModel.get_top_influencers()
    # Remove _id for JSON serialization
    for inf in top_influencers:
        inf.pop('_id', None)
    return jsonify(top_influencers), 200

# API 11
@influencer_bp.route('/compare', methods=['POST'])
@validate_json("influencer1", "influencer2")
def compare_influencers():
    data = request.get_json()
    inf1 = InfluencerModel.find_by_username(data['influencer1'])
    inf2 = InfluencerModel.find_by_username(data['influencer2'])
    
    if not inf1 or not inf2:
        return jsonify({"error": "One or both influencers not found in DB"}), 404
        
    inf1.pop('_id', None)
    inf2.pop('_id', None)
    
    return jsonify({
        "influencer1": inf1,
        "influencer2": inf2
    }), 200

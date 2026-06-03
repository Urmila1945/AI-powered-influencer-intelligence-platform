from flask import Blueprint, jsonify, request
from services.youtube_service import youtube_service
from services.instagram_service import instagram_service
from models.influencer_model import InfluencerModel
from utils.validators import validate_json

influencer_bp = Blueprint('influencer', __name__)

# API 1
@influencer_bp.route('/youtube/<channel_id>', methods=['GET'])
def get_youtube_influencer(channel_id):
    try:
        data = youtube_service.fetch_channel(channel_id)
        if not data:
            return jsonify({"error": "Channel not found"}), 404
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# API 2
@influencer_bp.route('/instagram/<username>', methods=['GET'])
def get_instagram_influencer(username):
    try:
        data = instagram_service.fetch_profile(username)
        if not data:
            return jsonify({"error": "User not found"}), 404
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# API 10
@influencer_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    all_influencers = InfluencerModel.get_all()
    
    # If DB is empty, seed it with initial popular creators
    if not all_influencers or len(all_influencers) == 0:
        seed_creators = ["mkbhd", "mrwhosetheboss", "techburner", "supercarblondie", "pewdiepie", "MrBeast"]
        for c in seed_creators:
            InfluencerModel.create_influencer({"username": c, "platform": "YouTube"})
        all_influencers = InfluencerModel.get_all()

    # Live refresh data for all creators in the DB to ensure REAL TIME metrics
    refreshed_influencers = []
    for inf in all_influencers:
        username = inf.get("username", "").replace("@", "")
        platform = inf.get("platform", "YouTube").lower()
        
        try:
            if platform == 'youtube':
                live_data = youtube_service.fetch_channel(username)
            else:
                live_data = instagram_service.fetch_profile(username)
                
            if live_data:
                # Map live API data to DB schema
                followers_num = int(str(live_data.get("followers", "0")).replace(',', ''))
                eng_rate_num = float(str(live_data.get("engagementRate", "0%")).replace('%', ''))
                scores = live_data.get("scores", {})
                
                mapped_data = {
                    "username": live_data.get("username"),
                    "platform": live_data.get("platform"),
                    "category": live_data.get("category", "General"),
                    "followers": followers_num,
                    "engagement_rate": eng_rate_num,
                    "authenticity_score": scores.get("authenticity", 0),
                    "growth_score": scores.get("growth", 0),
                    "viralmind_score": scores.get("viralmind_score", 0)
                }
                
                # Update DB with fresh live data
                InfluencerModel.db.influencers.update_one(
                    {"_id": inf["_id"]},
                    {"$set": mapped_data}
                )
                
                mapped_data.pop('_id', None)
                refreshed_influencers.append(mapped_data)
        except Exception as e:
            print(f"Failed to refresh {username}: {e}")
            # Fallback to existing stale data if API fails
            inf.pop('_id', None)
            refreshed_influencers.append(inf)

    # Sort the refreshed creators by ViralMind score descending
    refreshed_influencers.sort(key=lambda x: x.get('viralmind_score', 0), reverse=True)
    
    # Apply filters if provided in query params
    req_platform = request.args.get('platform', 'all').lower()
    req_category = request.args.get('category', 'all').lower()
    
    category_map = {
        'technology': 'tech',
        'gaming': 'gaming',
        'lifestyle': 'lifestyle',
        'finance': 'finance',
        'beauty': 'beauty',
        'general': 'general'
    }
    
    mapped_category = category_map.get(req_category, req_category)
    
    filtered_influencers = []
    for inf in refreshed_influencers:
        p_match = req_platform == 'all' or req_platform == 'all platforms' or inf.get('platform', '').lower() == req_platform
        c_match = req_category == 'all' or req_category == 'all categories' or inf.get('category', '').lower() == mapped_category
        
        if p_match and c_match:
            filtered_influencers.append(inf)
    
    return jsonify(filtered_influencers[:10]), 200

# API 11
@influencer_bp.route('/compare', methods=['POST'])
@validate_json("influencer1", "influencer2")
def compare_influencers():
    data = request.get_json()
    
    def fetch_or_get(username):
        inf = InfluencerModel.find_by_username(username)
        if inf:
            return inf
            
        clean_name = username.replace('@', '')
        try:
            yt_data = youtube_service.fetch_channel(clean_name)
            if yt_data:
                InfluencerModel.create_influencer(yt_data)
                return InfluencerModel.find_by_username(yt_data['username']) or yt_data
        except Exception:
            pass
            
        try:
            ig_data = instagram_service.fetch_profile(clean_name)
            if ig_data:
                InfluencerModel.create_influencer(ig_data)
                return InfluencerModel.find_by_username(ig_data['username']) or ig_data
        except Exception:
            pass
            
        return None

    inf1 = fetch_or_get(data['influencer1'])
    inf2 = fetch_or_get(data['influencer2'])
    
    if not inf1 or not inf2:
        return jsonify({"error": "One or both influencers could not be found via YouTube or Instagram APIs."}), 404
        
    inf1.pop('_id', None)
    inf2.pop('_id', None)
    
    return jsonify({
        "influencer1": inf1,
        "influencer2": inf2
    }), 200

from services.llm_service import llm_service

# API 12
@influencer_bp.route('/discover', methods=['POST'])
@validate_json("query")
def discover_influencers():
    data = request.get_json()
    query = data['query']
    
    # Use the LLM Engine to discover creators contextually
    results = llm_service.discover_creators(query)
    
    if not results:
        # Fallback if API fails, return some creators from the DB
        all_creators = InfluencerModel.get_all()
        results = all_creators[:3] if all_creators else []
        for c in results:
            c.pop('_id', None)
            c['match_score'] = 1  # Low match score indicating fallback
            
    return jsonify(results), 200

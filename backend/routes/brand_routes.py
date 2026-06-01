from flask import Blueprint, jsonify, request
from ml.similarity_engine import similarity_engine
from models.influencer_model import InfluencerModel
from utils.validators import validate_json

brand_bp = Blueprint('brand', __name__)

# Dummy Brand Database for testing
BRANDS_DB = [
    {"brand": "Samsung", "description": "Tech electronics mobile phones gadgets"},
    {"brand": "OnePlus", "description": "Tech electronics fast charging smartphones"},
    {"brand": "Nike", "description": "Sports apparel shoes fitness"},
    {"brand": "Loreal", "description": "Beauty makeup cosmetics skincare"}
]

# API 6
@brand_bp.route('/brand-match', methods=['POST'])
@validate_json("creator_bio", "creator_category")
def brand_match():
    data = request.get_json()
    matches = similarity_engine.find_similar_brands(
        data['creator_bio'], 
        data['creator_category'], 
        BRANDS_DB
    )
    return jsonify(matches), 200

# API 7
@brand_bp.route('/similar-creators', methods=['POST'])
@validate_json("creator_name")
def similar_creators():
    data = request.get_json()
    creator_name = data['creator_name']
    
    # In a real app we'd fetch the creator's bio from the DB first.
    target_creator = InfluencerModel.find_by_username(creator_name)
    creator_bio = target_creator.get("bio", "Tech influencer") if target_creator else "Tech creator"
    
    all_creators = InfluencerModel.get_all()
    # Exclude the target creator
    other_creators = [c for c in all_creators if c.get('username') != creator_name]
    
    if not other_creators:
        # Fallback dummy data if DB is empty
        other_creators = [
            {"username": "TechBurner", "bio": "Tech videos gadgets"},
            {"username": "MKBHD", "bio": "Tech reviews smartphones cameras"},
            {"username": "Mrwhosetheboss", "bio": "Tech innovations phones gadget tests"}
        ]
        
    similar = similarity_engine.find_similar_creators(creator_bio, other_creators)
    return jsonify(similar), 200

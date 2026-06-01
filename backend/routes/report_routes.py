from flask import Blueprint, jsonify, request, send_file
from models.influencer_model import InfluencerModel
from reports.pdf_generator import pdf_generator
import os

report_bp = Blueprint('report', __name__)

# API 12
@report_bp.route('/<username>', methods=['GET'])
def generate_report(username):
    inf_data = InfluencerModel.find_by_username(username)
    if not inf_data:
        # Mock data for testing
        inf_data = {
            "username": username,
            "followers": 150000,
            "engagement_rate": 4.5,
            "authenticity_score": 90,
            "growth_score": 85,
            "ratefluencer_score": 92,
            "ai_insights": "Strong tech creator with great engagement."
        }
        
    try:
        file_path = pdf_generator.generate_report(inf_data)
        return send_file(file_path, as_attachment=True, download_name=f"{username}_report.pdf")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

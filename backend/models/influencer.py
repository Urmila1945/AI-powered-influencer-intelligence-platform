from datetime import datetime

class InfluencerModel:
    @staticmethod
    def create_influencer_document(platform, username, data):
        """
        Creates a structured document for insertion into MongoDB.
        """
        return {
            "platform": platform,
            "username": username,
            "followers": data.get("followers", 0),
            "following": data.get("following", 0),
            "engagement_rate": data.get("engagement_rate", 0.0),
            "content_category": data.get("content_category", "Unknown"),
            "posting_frequency": data.get("posting_frequency", "Unknown"),
            "audience_demographics": data.get("audience_demographics", {}),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

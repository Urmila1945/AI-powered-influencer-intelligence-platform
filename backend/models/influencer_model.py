import uuid
from database.mongodb import get_db

class InfluencerModel:
    @staticmethod
    def get_collection():
        return get_db()['influencers']

    @staticmethod
    def create_influencer(data):
        import uuid
        from datetime import datetime, timezone
        
        # Clone the dict to avoid modifying the input
        influencer_doc = dict(data)
        influencer_doc["_id"] = str(uuid.uuid4())
        influencer_doc["username_lower"] = data.get("username", "").lower().replace("@", "")
        influencer_doc["platform_lower"] = data.get("platform", "").lower()
        influencer_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        InfluencerModel.get_collection().insert_one(influencer_doc)
        return influencer_doc
        
    @staticmethod
    def find_by_platform_and_username(platform, username):
        from datetime import datetime, timezone, timedelta
        
        # Strip @ from username and lowercase
        clean_username = username.lower().replace("@", "")
        clean_platform = platform.lower()
        
        doc = InfluencerModel.get_collection().find_one({
            "platform_lower": clean_platform,
            "username_lower": clean_username
        })
        
        if doc:
            # Check if it's older than 24 hours
            updated_at = doc.get("updated_at")
            if updated_at:
                try:
                    updated_time = datetime.fromisoformat(updated_at)
                    if datetime.now(timezone.utc) - updated_time > timedelta(hours=24):
                        return None # Cache expired
                except:
                    pass
        return doc

    @staticmethod
    def update_scores(username, scores):
        InfluencerModel.get_collection().update_one(
            {"username": username},
            {"$set": scores}
        )

    @staticmethod
    def find_by_username(username):
        return InfluencerModel.get_collection().find_one({"username": username})

    @staticmethod
    def get_all():
        return list(InfluencerModel.get_collection().find())

    @staticmethod
    def get_top_influencers(limit=10):
        return list(InfluencerModel.get_collection().find().sort("viralmind_score", -1).limit(limit))

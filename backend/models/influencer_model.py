import uuid
from database.mongodb import get_db

class InfluencerModel:
    @staticmethod
    def get_collection():
        return get_db()['influencers']

    @staticmethod
    def create_influencer(data):
        """
        data dictionary should contain:
        username, platform, followers, following, likes, comments,
        engagement_rate, authenticity_score, growth_score, campaign_score, viralmind_score
        """
        influencer_doc = {
            "_id": str(uuid.uuid4()),
            "username": data.get("username", ""),
            "platform": data.get("platform", ""),
            "followers": data.get("followers", 0),
            "following": data.get("following", 0),
            "likes": data.get("likes", 0),
            "comments": data.get("comments", 0),
            "engagement_rate": data.get("engagement_rate", 0.0),
            "authenticity_score": data.get("authenticity_score", 0),
            "growth_score": data.get("growth_score", 0),
            "campaign_score": data.get("campaign_score", 0),
            "viralmind_score": data.get("viralmind_score", 0)
        }
        InfluencerModel.get_collection().insert_one(influencer_doc)
        return influencer_doc

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

import uuid
from datetime import datetime, timezone
from database.mongodb import get_db

class ActivityModel:
    @staticmethod
    def get_collection():
        return get_db()['activities']

    @staticmethod
    def log_activity(user_id, user_email, action, details=""):
        activity_doc = {
            "_id": str(uuid.uuid4()),
            "user_id": user_id,
            "user_email": user_email,
            "action": action,
            "details": details,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        ActivityModel.get_collection().insert_one(activity_doc)
        return activity_doc

    @staticmethod
    def get_recent_activities(limit=50):
        # Sort by timestamp descending
        activities = list(ActivityModel.get_collection().find().sort("timestamp", -1).limit(limit))
        return activities

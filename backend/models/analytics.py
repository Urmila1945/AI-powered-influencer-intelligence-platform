from datetime import datetime

class AnalyticsModel:
    @staticmethod
    def create_analytics_document(username, metrics):
        """
        Creates a structured analytics document for MongoDB.
        """
        return {
            "username": username,
            "ratefluencer_score": metrics.get("ratefluencer_score", 0),
            "authenticity_score": metrics.get("authenticity_score", 0),
            "growth_predictions": metrics.get("growth_predictions", {}),
            "timestamp": datetime.utcnow()
        }

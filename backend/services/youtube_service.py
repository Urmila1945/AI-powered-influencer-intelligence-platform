import requests
from config import config

class YouTubeService:
    def __init__(self):
        self.api_key = config.YOUTUBE_API_KEY
        self.base_url = "https://www.googleapis.com/youtube/v3/channels"

    def fetch_channel(self, channel_id):
        if not self.api_key:
            # Mock data
            return {
                "subscribers": 1200000,
                "views": 50000000,
                "videos": 450,
                "engagement": 6.8
            }
            
        params = {
            "part": "statistics,snippet",
            "id": channel_id,
            "key": self.api_key
        }
        try:
            response = requests.get(self.base_url, params=params)
            data = response.json()
            if "items" in data and len(data["items"]) > 0:
                stats = data["items"][0]["statistics"]
                return {
                    "subscribers": int(stats.get("subscriberCount", 0)),
                    "views": int(stats.get("viewCount", 0)),
                    "videos": int(stats.get("videoCount", 0)),
                    "engagement": 5.0 # Rough estimate
                }
            return {}
        except Exception as e:
            print(f"YouTube API Error: {e}")
            return {}

youtube_service = YouTubeService()

import requests
from config import config

class ApifyInstagramService:
    def __init__(self):
        self.api_token = config.APIFY_API_TOKEN
        self.base_url = "https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items"

    def fetch_profile(self, username):
        if not self.api_token:
            # Mock data if no token
            return {
                "followers": 150000,
                "following": 400,
                "posts": 120,
                "bio": "Content Creator | Tech Enthusiast",
                "engagement": 4.5
            }
            
        params = {
            "token": self.api_token,
            "usernames": [username]
        }
        try:
            response = requests.post(self.base_url, json=params)
            data = response.json()
            if data and len(data) > 0:
                profile = data[0]
                return {
                    "followers": profile.get("followersCount", 0),
                    "following": profile.get("followsCount", 0),
                    "posts": profile.get("postsCount", 0),
                    "bio": profile.get("biography", ""),
                    "engagement": 0.0 # Calculate based on recent posts in real scenario
                }
            return {}
        except Exception as e:
            print(f"Apify Error: {e}")
            return {}

instagram_service = ApifyInstagramService()

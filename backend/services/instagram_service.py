import requests
import random
import hashlib
from config import config

# Import ML models
from ml.authenticity_model import authenticity_model
from ml.growth_prediction import growth_model
from ml.campaign_predictor import campaign_predictor
from utils.score_calculator import score_calculator
from services.llm_service import llm_service

class ApifyInstagramService:
    def __init__(self):
        self.api_token = config.APIFY_API_TOKEN
        self.base_url = "https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items"

    def _generate_mock_data(self, username):
        # Generate consistent random numbers based on username hash
        seed = int(hashlib.md5(username.encode()).hexdigest(), 16)
        random.seed(seed)
        
        followers = random.randint(10000, 5000000)
        
        return {
            "name": username.capitalize(),
            "username": f"@{username}",
            "platform": "Instagram",
            "category": random.choice(["Lifestyle", "Fashion", "Tech", "Beauty", "Gaming", "Fitness"]),
            "followers": f"{followers:,}",
            "following": str(random.randint(50, 1500)),
            "posts": str(random.randint(20, 3000)),
            "views": f"{random.randint(1, 500)}M",
            "bio": f"Official {username} account. Content Creator.",
            "engagementRate": f"{round(random.uniform(1.5, 12.5), 1)}%",
            "scores": {
                "authenticity": random.randint(70, 99),
                "growth": random.randint(60, 98),
                "aqi": random.randint(65, 99),
                "campaignSuccess": random.randint(70, 95),
            },
            "riskLevel": random.choice(["Low", "Low", "Medium", "High"])
        }

    def fetch_profile(self, username):
        if not self.api_token:
            raise ValueError("Apify API token is missing. Please add APIFY_TOKEN to your .env file.")
            
        params = {
            "token": self.api_token
        }
        payload = {
            "usernames": [username]
        }
        try:
            response = requests.post(self.base_url, params=params, json=payload)
            response.raise_for_status()
            data = response.json()
            if data and len(data) > 0:
                profile = data[0]
                
                seed = int(hashlib.md5(username.encode()).hexdigest(), 16)
                random.seed(seed)
                
                followers = int(profile.get("followersCount", 1))
                following = int(profile.get("followsCount", 0))
                posts = int(profile.get("postsCount", 0))
                eng_rate = 2.5 # Default heuristic if no post data
                
                # Try to pull actual likes/comments/views from latest posts if available
                real_likes = 0
                real_comments = 0
                real_views = 0
                videos_count = 0
                latest_posts = profile.get("latestPosts", [])
                
                if latest_posts and len(latest_posts) > 0:
                    for post in latest_posts:
                        real_likes += int(post.get("likesCount", 0) or 0)
                        real_comments += int(post.get("commentsCount", 0) or 0)
                        
                        v_views = int(post.get("videoViewCount", 0) or post.get("playCount", 0) or 0)
                        if v_views > 0:
                            real_views += v_views
                            videos_count += 1
                    
                    avg_likes = real_likes / len(latest_posts)
                    avg_comments = real_comments / len(latest_posts)
                    
                    likes = int(avg_likes * posts)
                    comments = int(avg_comments * posts)
                    
                    if videos_count > 0:
                        avg_views = real_views / videos_count
                        views = int(avg_views * posts)
                    else:
                        # Fallback for photo-only accounts
                        views = int(likes * 8.5)
                    
                    # Recalculate true engagement rate based on real post data
                    avg_eng = (avg_likes + avg_comments) / max(followers, 1) * 100
                    eng_rate = min(max(avg_eng, 0.5), 25.0)
                    
                    shares = int(likes * 0.04)
                    saves = int(likes * 0.01)
                else:
                    estimated_engagements = int(followers * (eng_rate / 100))
                    likes = int(estimated_engagements * 0.85)
                    comments = int(estimated_engagements * 0.10)
                    shares = int(estimated_engagements * 0.04)
                    saves = int(estimated_engagements * 0.01)
                    views = int(likes * 8.5)

                # Predict category from bio
                bio = profile.get("biography", "")
                category = "General"
                bio_lower = bio.lower()
                if any(w in bio_lower for w in ["model", "fashion", "style"]): category = "Fashion"
                elif any(w in bio_lower for w in ["fitness", "gym", "workout"]): category = "Fitness"
                elif any(w in bio_lower for w in ["makeup", "beauty", "cosmetics"]): category = "Beauty"
                elif any(w in bio_lower for w in ["tech", "gadget", "software"]): category = "Tech"
                elif any(w in bio_lower for w in ["game", "twitch"]): category = "Gaming"
                elif any(w in bio_lower for w in ["travel", "life", "vlog"]): category = "Lifestyle"

                # ML Calculations
                authenticity = authenticity_model.predict(followers, following, eng_rate, 80)
                
                growth_dict = growth_model.predict(followers, 2.5, eng_rate)
                growth = growth_dict["growth_score"]
                
                campaign = campaign_predictor.predict(eng_rate, followers, category)
                
                # Deterministic AQI
                aqi = min(100, int((authenticity * 0.7) + (eng_rate * 2.5)))
                
                overall_score = score_calculator.calculate_ratefluencer_score(
                    authenticity=authenticity,
                    engagement=eng_rate,
                    growth=growth,
                    audience_quality=aqi,
                    brand_relevance=80
                )

                risk_level = "Low" if authenticity >= 80 else "Medium" if authenticity >= 60 else "High"
                bio = profile.get("biography", "")
                
                # Fetch dynamic AI insights using the Groq API
                ai_data = llm_service.generate_demographics_and_brands(bio, category, "Instagram")
                brands = ai_data.get("brandMatches", [])
                brand_match_score = brands[0]['score'] if brands else 50
                demographics = ai_data.get("demographics", {})
                
                posting_frequency = f"{random.randint(3, 7)} posts/week" if posts > 100 else f"{random.randint(1, 4)} posts/month"

                return {
                    "name": profile.get("fullName", username),
                    "username": f"@{username}",
                    "platform": "Instagram",
                    "category": category,
                    "followers": f"{followers:,}",
                    "following": f"{following:,}",
                    "posts": f"{posts:,}",
                    "postingFrequency": posting_frequency,
                    "views": f"{views:,}",
                    "likes": f"{likes:,}",
                    "comments": f"{comments:,}",
                    "shares": f"{shares:,}",
                    "saves": f"{saves:,}",
                    "bio": bio,
                    "engagementRate": f"{eng_rate:.1f}%",
                    "scores": {
                        "authenticity": authenticity,
                        "growth": growth,
                        "aqi": aqi,
                        "campaignSuccess": campaign,
                        "brandMatchScore": brand_match_score,
                        "ratefluencer_score": overall_score
                    },
                    "brandMatches": brands[:3],
                    "demographics": demographics,
                    "riskLevel": risk_level
                }
            raise ValueError(f"No Instagram profile found for {username} or API quota exceeded.")
        except Exception as e:
            print(f"Apify Error: {e}")
            raise Exception(f"Instagram API Error: {str(e)}")

instagram_service = ApifyInstagramService()

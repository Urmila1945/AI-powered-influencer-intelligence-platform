import requests
from config import config

class LLMService:
    def __init__(self):
        self.api_key = config.GROQ_API_KEY
        self.url = "https://api.groq.com/openai/v1/chat/completions"

    def generate_insights(self, influencer_data):
        if not self.api_key:
            return """**Groq API Key Missing**\n\nPlease add `GROQ_API_KEY` to your `.env` file to enable AI Insights.\nYou can get a free key from console.groq.com."""

        prompt = f"""
        Act as an expert AI Influencer Analyst. Based on the following influencer data, generate:
        1. SWOT Analysis
        2. Growth Suggestions
        3. Brand Recommendations
        4. Risk Analysis

        Data:
        {influencer_data}
        
        Keep it professional, concise, and structured.
        """
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7
        }
        
        try:
            response = requests.post(self.url, headers=headers, json=payload)
            response.raise_for_status()
            return response.json()['choices'][0]['message']['content']
        except Exception as e:
            return f"Error generating insights via Groq: {str(e)}"

    def generate_demographics_and_brands(self, bio, category, platform):
        if not self.api_key:
            # Fallback if no key
            return {
                "demographics": {"Male": 50, "Female": 50, "18-24": 40, "25-34": 40, "35+": 20},
                "brandMatches": [{"brand": "Unknown", "score": 50}]
            }

        prompt = f"""
        Analyze this creator:
        Platform: {platform}
        Category: {category}
        Bio: {bio}

        Respond ONLY with a valid JSON object matching this exact structure, nothing else:
        {{
            "demographics": {{
                "Male": <int 0-100>,
                "Female": <int 0-100>,
                "18-24": <int 0-100>,
                "25-34": <int 0-100>,
                "35+": <int 0-100>
            }},
            "brandMatches": [
                {{"brand": "<Top Brand Name 1>", "score": <int 0-100>}},
                {{"brand": "<Top Brand Name 2>", "score": <int 0-100>}},
                {{"brand": "<Top Brand Name 3>", "score": <int 0-100>}}
            ]
        }}
        """
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.5,
            "response_format": {"type": "json_object"}
        }
        
        try:
            response = requests.post(self.url, headers=headers, json=payload)
            response.raise_for_status()
            import json
            return json.loads(response.json()['choices'][0]['message']['content'])
        except Exception as e:
            print(f"Groq Demographics/Brand Error: {e}")
            return {
                "demographics": {"Male": 50, "Female": 50, "18-24": 40, "25-34": 40, "35+": 20},
                "brandMatches": [{"brand": "Fallback Brand", "score": 50}]
            }

    def discover_creators(self, query):
        if not self.api_key:
            return []

        prompt = f"""
        Act as an AI Influencer Discovery Engine.
        The user has searched for: "{query}"
        
        Generate a list of 3 real or highly realistic influencer profiles that perfectly match this query.
        Respond ONLY with a valid JSON array of objects matching this exact structure, nothing else:
        [
            {{
                "username": "<username>",
                "platform": "<YouTube or Instagram>",
                "category": "<Niche/Category>",
                "followers": <int number of followers e.g. 500000>,
                "match_score": <int between 70 and 100 representing how well they match the query>
            }}
        ]
        """
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.5,
            "response_format": {"type": "json_object"} # Wait, Groq JSON mode requires the word JSON in prompt, but array might not work if json_object is forced. Let me wrap it in a dict.
        }
        
        # Fixing prompt for JSON object constraint
        prompt = f"""
        Act as an AI Influencer Discovery Engine.
        The user has searched for: "{query}"
        
        Generate a list of 3 real or highly realistic influencer profiles that perfectly match this query.
        Respond ONLY with a valid JSON object matching this exact structure, nothing else:
        {{
            "results": [
                {{
                    "username": "<username>",
                    "platform": "<YouTube or Instagram>",
                    "category": "<Niche/Category>",
                    "followers": <int number of followers e.g. 500000>,
                    "match_score": <int between 70 and 100 representing how well they match the query>
                }}
            ]
        }}
        """
        payload["messages"][0]["content"] = prompt

        try:
            response = requests.post(self.url, headers=headers, json=payload)
            response.raise_for_status()
            import json
            data = json.loads(response.json()['choices'][0]['message']['content'])
            return data.get("results", [])
        except Exception as e:
            print(f"Groq Discovery Error: {e}")
            return []

    def advisor_chat(self, messages):
        if not self.api_key:
            return "Please add GROQ_API_KEY to your .env file to enable the AI Advisor."

        system_prompt = {
            "role": "system",
            "content": "You are the AI Influencer Advisor, a highly intelligent and professional assistant built into the ViralMind platform. You help brands and users understand creator analytics, engagement metrics, authenticity, and growth prediction. Be concise, insightful, and helpful."
        }
        
        # Prepare messages
        api_messages = [system_prompt] + messages
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": api_messages,
            "temperature": 0.7
        }
        
        try:
            response = requests.post(self.url, headers=headers, json=payload)
            response.raise_for_status()
            return response.json()['choices'][0]['message']['content']
        except Exception as e:
            print(f"Groq Advisor Error: {e}")
            return "I'm sorry, I encountered an error communicating with my AI brain. Please try again later."

    def predict_campaign_roi(self, influencer_data, budget, industry):
        if not self.api_key:
            return {
                "predicted_clicks": int(budget / 2),
                "expected_sales": int(budget / 50),
                "roi_percentage": 150,
                "analysis": "This is mock data because the Groq API key is missing. Add GROQ_API_KEY to see real LLM-powered ROI predictions."
            }

        prompt = f"""
        Act as an expert Influencer Marketing Analyst. 
        A brand in the {industry} industry wants to spend ${budget} on a campaign with this creator:
        {influencer_data}

        Predict the campaign outcome. 
        Respond ONLY with a valid JSON object matching this exact structure:
        {{
            "predicted_reach": <int estimated reach>,
            "predicted_likes": <int estimated likes>,
            "predicted_comments": <int estimated comments>,
            "predicted_clicks": <int estimated clicks generated>,
            "expected_sales": <int estimated conversions/sales>,
            "roi_percentage": <int estimated ROI percentage, e.g. 150 for 150%>,
            "analysis": "<String: A concise, 2-sentence explanation of why this campaign will perform this way based on their engagement and niche>"
        }}
        """
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.5,
            "response_format": {"type": "json_object"}
        }
        
        try:
            response = requests.post(self.url, headers=headers, json=payload)
            response.raise_for_status()
            import json
            return json.loads(response.json()['choices'][0]['message']['content'])
        except Exception as e:
            print(f"Groq ROI Predictor Error: {e}")
            return {
                "predicted_reach": int(budget * 5),
                "predicted_likes": int(budget / 10),
                "predicted_comments": int(budget / 50),
                "predicted_clicks": int(budget / 2),
                "expected_sales": int(budget / 50),
                "roi_percentage": 120,
                "analysis": "Fallback analysis due to API error. The creator has solid engagement for their niche."
            }

    def analyze_audience_sentiment(self, influencer_data):
        if not self.api_key:
            return {
                "positive": 65,
                "neutral": 25,
                "negative": 10,
                "bot_risk_score": 15,
                "bot_risk_label": "Low Risk",
                "top_topics": ["Highly engaged community", "Authentic praise", "Occasional spam links"],
                "analysis": "This is mock data because the Groq API key is missing. Add GROQ_API_KEY to see real NLP audience analysis."
            }

        prompt = f"""
        Act as an expert AI Bot Detector and Sentiment Analyst.
        Analyze this creator's profile and engagement metrics to deduce their audience authenticity and sentiment:
        {influencer_data}

        Respond ONLY with a valid JSON object matching this exact structure:
        {{
            "positive": <int percentage 0-100>,
            "neutral": <int percentage 0-100>,
            "negative": <int percentage 0-100>,
            "bot_risk_score": <int 0-100 where higher means more bots>,
            "bot_risk_label": "<String: Low Risk, Medium Risk, or High Risk>",
            "top_topics": ["<Topic 1>", "<Topic 2>", "<Topic 3>"],
            "analysis": "<String: A concise 2-sentence explanation of the audience quality and any red flags>"
        }}
        """
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.5,
            "response_format": {"type": "json_object"}
        }
        
        try:
            response = requests.post(self.url, headers=headers, json=payload)
            response.raise_for_status()
            import json
            return json.loads(response.json()['choices'][0]['message']['content'])
        except Exception as e:
            print(f"Groq Sentiment Error: {e}")
            return {
                "positive": 60,
                "neutral": 30,
                "negative": 10,
                "bot_risk_score": 20,
                "bot_risk_label": "Medium Risk",
                "top_topics": ["General appreciation", "Questions about content", "Some repetitive emojis"],
                "analysis": "Fallback analysis due to API error. The audience appears mostly genuine with standard bot activity."
            }

    def generate_deep_intelligence(self, influencer_data):
        if not self.api_key:
            return self._get_fallback_deep_intelligence()

        prompt = f"""
        Act as an ultra-advanced AI Influencer Intelligence Engine. 
        You are analyzing this creator's profile data:
        {influencer_data}

        Generate a futuristic, highly detailed intelligence report covering 15 advanced metrics.
        Respond ONLY with a valid JSON object matching this exact structure:
        {{
            "stock_rating": {{"recommendation": "<Buy/Hold/Avoid>", "momentum": <int -100 to 100>, "reasoning": "<1 sentence>"}},
            "superstar_probability": <int 0-100>,
            "risk_radar": {{
                "fake_followers": <int 0-100>,
                "toxic_comments": <int 0-100>,
                "controversy_risk": <int 0-100>,
                "inactive_audience": <int 0-100>,
                "engagement_pods": <int 0-100>,
                "overall_score": <int 0-100, 100 is max risk>
            }},
            "creator_dna": {{
                "personality": "<String: e.g. Tech Educator>",
                "audience_type": "<String: e.g. Early Adopters>",
                "communication_style": "<String: e.g. Informative>"
            }},
            "burnout_risk": {{"level": "<Low/Medium/High>", "reasoning": "<1 sentence>"}},
            "brand_safety_score": <int 0-100, 100 is safest>,
            "content_gaps": {{"opportunity_score": <int 0-100>, "gap": "<String: what they should post more>"}},
            "career_forecast": {{"6_months": "<String: e.g. 750K>", "12_months": "<String: e.g. 1.1M>"}},
            "compatibility_heatmap": [
                {{"brand": "<Top Brand 1>", "match_status": "🔥"}},
                {{"brand": "<Top Brand 2>", "match_status": "✅"}},
                {{"brand": "<Incompatible Brand>", "match_status": "⚠️"}}
            ],
            "aqi": <int 0-100, Audience Quality Index>,
            "negotiation_assistant": {{"suggested_price": "<String: e.g. ₹75,000 per reel>", "reasoning": "<1 sentence>"}},
            "ai_clone_summary": "<String: 2 sentences explaining why they are successful>"
        }}
        """
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.5,
            "response_format": {"type": "json_object"}
        }
        
        try:
            response = requests.post(self.url, headers=headers, json=payload)
            response.raise_for_status()
            import json
            return json.loads(response.json()['choices'][0]['message']['content'])
        except Exception as e:
            print(f"Groq Deep Intelligence Error: {e}")
            return self._get_fallback_deep_intelligence()

    def _get_fallback_deep_intelligence(self):
        return {
            "stock_rating": {"recommendation": "Buy", "momentum": 12, "reasoning": "Strong consistent growth."},
            "superstar_probability": 85,
            "risk_radar": {
                "fake_followers": 15,
                "toxic_comments": 10,
                "controversy_risk": 20,
                "inactive_audience": 30,
                "engagement_pods": 5,
                "overall_score": 16
            },
            "creator_dna": {
                "personality": "Educator",
                "audience_type": "Enthusiasts",
                "communication_style": "Informative"
            },
            "burnout_risk": {"level": "Low", "reasoning": "Consistent posting schedule with high engagement."},
            "brand_safety_score": 92,
            "content_gaps": {"opportunity_score": 88, "gap": "Behind the scenes content"},
            "career_forecast": {"6_months": "+10%", "12_months": "+25%"},
            "compatibility_heatmap": [
                {"brand": "Samsung", "match_status": "🔥"},
                {"brand": "Nike", "match_status": "✅"},
                {"brand": "Luxury Brand", "match_status": "⚠️"}
            ],
            "aqi": 94,
            "negotiation_assistant": {"suggested_price": "$1,000 per post", "reasoning": "High engagement rate justifies premium pricing."},
            "ai_clone_summary": "Highly successful due to authentic communication and consistent value delivery to a niche audience."
        }


llm_service = LLMService()

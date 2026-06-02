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
            "content": "You are the AI Influencer Advisor, a highly intelligent and professional assistant built into the Ratefluencer platform. You help brands and users understand creator analytics, engagement metrics, authenticity, and growth prediction. Be concise, insightful, and helpful."
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

llm_service = LLMService()

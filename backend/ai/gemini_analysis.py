import google.generativeai as genai
from config import config

# Configure Gemini
genai.configure(api_key=config.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

class GeminiAnalyzer:
    @staticmethod
    def generate_insights(influencer_data):
        """
        Bonus 7: AI Recommendation Engine
        Generate AI insights and Action Plan.
        """
        prompt = f"""
        Analyze the following influencer data and provide strengths, weaknesses, brand recommendations, 
        and a detailed AI Action Plan for growth.
        Data: {influencer_data}
        """
        
        # In a real app we'd call the model here:
        # response = model.generate_content(prompt)
        # return response.text
        
        return "Action Plan: 1. Post more shorts. 2. Tag relevant brands."

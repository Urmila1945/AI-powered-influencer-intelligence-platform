import google.generativeai as genai
from config import config

class GeminiService:
    def __init__(self):
        genai.configure(api_key=config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')

    def generate_insights(self, influencer_data):
        if not config.GEMINI_API_KEY:
            return "Gemini API key not configured. Mock Insights: SWOT Analysis: Strong following. Growth: Post consistently. Brands: Tech companies."

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
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating insights: {str(e)}"

gemini_service = GeminiService()

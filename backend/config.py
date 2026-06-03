import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Flask settings
    SECRET_KEY = os.getenv("SECRET_KEY", "ratefluencer_super_secret_key_123")
    DEBUG = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1", "t")

    # JWT Authentication
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "ratefluencer_jwt_secret_456")

    # MongoDB settings
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
    MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "ratefluencer_db")

    # API Keys
    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")
    APIFY_API_TOKEN = os.getenv("APIFY_TOKEN", os.getenv("APIFY_API_TOKEN", ""))
    RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

config = Config()

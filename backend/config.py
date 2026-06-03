import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Flask settings
    SECRET_KEY = os.getenv("SECRET_KEY", "viralmind_super_secret_key_123")
    DEBUG = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1", "t")

    # JWT Authentication
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "viralmind_jwt_secret_456")

    # MongoDB settings
    # Hardcoded to bypass any bad Render environment variables
    MONGODB_URI = "mongodb+srv://urmilakshirsagar1945_db_user:uMS5VIcci8yvW1qi@cluster0.eyljghf.mongodb.net/?appName=Cluster0"
    MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "viralmind_db")

    # API Keys
    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-key")
    APIFY_API_TOKEN = os.getenv("APIFY_TOKEN", os.getenv("APIFY_API_TOKEN", ""))
    RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

config = Config()

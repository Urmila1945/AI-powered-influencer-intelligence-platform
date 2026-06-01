from pymongo import MongoClient
from config import config

class MongoDB:
    def __init__(self):
        self.client = None
        self.db = None
        
    def connect(self):
        try:
            self.client = MongoClient(config.MONGODB_URI)
            self.db = self.client[config.MONGODB_DB_NAME]
            print(f"Connected to MongoDB: {config.MONGODB_DB_NAME}")
        except Exception as e:
            print(f"Failed to connect to MongoDB: {str(e)}")

    def get_db(self):
        if self.db is None:
            self.connect()
        return self.db

# Global instance
mongo = MongoDB()

def get_db():
    return mongo.get_db()

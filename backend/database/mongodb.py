import mongomock
from config import config

class MongoDB:
    def __init__(self):
        self.client = None
        self.db = None

    def connect(self):
        if self.client is not None:
            return

        try:
            # We use an in-memory mock database so no external cluster is needed!
            self.client = mongomock.MongoClient()
            self.db = self.client[config.MONGODB_DB_NAME]
            print(f"Connected to In-Memory MongoDB: {config.MONGODB_DB_NAME}")

        except Exception as e:
            print(f"Failed to connect to MongoDB: {e}")
            self.client = None
            self.db = None

    def get_db(self):
        if self.db is None:
            self.connect()
        return self.db

mongo = MongoDB()

def get_db():
    return mongo.get_db()

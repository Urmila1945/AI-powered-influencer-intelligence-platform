import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from database.mongodb import get_db

class UserModel:
    @staticmethod
    def get_collection():
        return get_db()['users']

    @staticmethod
    def create_user(name, email, password):
        hashed_password = generate_password_hash(password)
        is_admin = (email.lower() == 'urmilakshirsagar1945@gmail.com')
        user_doc = {
            "_id": str(uuid.uuid4()),
            "name": name,
            "email": email,
            "password": hashed_password,
            "is_admin": is_admin
        }
        UserModel.get_collection().insert_one(user_doc)
        return user_doc

    @staticmethod
    def make_admin(email):
        UserModel.get_collection().update_one({"email": email}, {"$set": {"is_admin": True}})

    @staticmethod
    def find_by_email(email):
        return UserModel.get_collection().find_one({"email": email})

    @staticmethod
    def find_by_id(user_id):
        return UserModel.get_collection().find_one({"_id": user_id})

    @staticmethod
    def verify_password(password, hashed_password):
        return check_password_hash(hashed_password, password)

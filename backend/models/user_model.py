import uuid
from passlib.hash import pbkdf2_sha256
from database.mongodb import get_db

class UserModel:
    @staticmethod
    def get_collection():
        return get_db()['users']

    @staticmethod
    def create_user(name, email, password):
        hashed_password = pbkdf2_sha256.hash(password)
        user_doc = {
            "_id": str(uuid.uuid4()),
            "name": name,
            "email": email,
            "password": hashed_password
        }
        UserModel.get_collection().insert_one(user_doc)
        return user_doc

    @staticmethod
    def find_by_email(email):
        return UserModel.get_collection().find_one({"email": email})

    @staticmethod
    def find_by_id(user_id):
        return UserModel.get_collection().find_one({"_id": user_id})

    @staticmethod
    def verify_password(password, hashed_password):
        return pbkdf2_sha256.verify(password, hashed_password)

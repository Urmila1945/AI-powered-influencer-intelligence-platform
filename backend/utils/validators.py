from functools import wraps
from flask import request, jsonify

def validate_json(*expected_args):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if not request.is_json:
                return jsonify({"error": "Missing JSON in request"}), 400
            
            data = request.get_json()
            missing = [arg for arg in expected_args if arg not in data]
            if missing:
                return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400
                
            return f(*args, **kwargs)
        return wrapper
    return decorator

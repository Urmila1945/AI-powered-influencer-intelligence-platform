from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
from database.mongodb import mongo

# Import Blueprints
from routes.influencer_routes import influencer_bp
from routes.score_routes import score_bp
from routes.brand_routes import brand_bp
from routes.analytics_routes import analytics_bp
from routes.report_routes import report_bp
from routes.auth_routes import auth_bp
from routes.bonus_routes import bonus_bp
from routes.config_routes import config_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)
    
    # Initialize JWT
    app.config['JWT_SECRET_KEY'] = config.JWT_SECRET_KEY
    jwt = JWTManager(app)
    
    # Enable CORS explicitly allowing all origins and headers
    CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*"}})

    # Initialize MongoDB connection
    mongo.connect()

    # Register Blueprints
    app.register_blueprint(influencer_bp, url_prefix='/api/influencer')
    app.register_blueprint(score_bp, url_prefix='/api')
    app.register_blueprint(brand_bp, url_prefix='/api/brand')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(report_bp, url_prefix='/api/report')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(bonus_bp, url_prefix='/api/bonus')
    app.register_blueprint(config_bp, url_prefix='/api/config')

    @app.route('/', methods=['GET'])
    def index():
        return jsonify({
            "message": "Welcome to the Ratefluencer API",
            "documentation": "Hit /health to check status, or use the /api/* endpoints."
        }), 200

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "service": "Ratefluencer API"}), 200

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    return app

# Instantiate app for Gunicorn
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=config.DEBUG)

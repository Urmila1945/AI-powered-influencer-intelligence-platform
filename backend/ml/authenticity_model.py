import numpy as np
from sklearn.ensemble import RandomForestRegressor

class AuthenticityModel:
    def __init__(self):
        # Using RandomForestRegressor since score is 0-100 instead of a binary classification.
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self._trained = False

    def train_dummy(self):
        # Create some dummy data to initialize the model if needed
        # Features: [followers, following, engagement_rate, comment_quality]
        X_dummy = np.array([
            [100000, 500, 5.5, 80],
            [50000, 10000, 1.2, 30],
            [10000, 100, 10.5, 95]
        ])
        # Target: Authenticity Score (0-100)
        y_dummy = np.array([91, 45, 98])
        self.model.fit(X_dummy, y_dummy)
        self._trained = True

    def predict(self, followers, following, engagement_rate, comment_quality):
        if not self._trained:
            self.train_dummy()
        
        # Predict authenticity score
        X_input = np.array([[followers, following, engagement_rate, comment_quality]])
        score = self.model.predict(X_input)[0]
        
        # Bound score between 0 and 100
        return max(0, min(100, int(score)))

# Singleton instance for the app
authenticity_model = AuthenticityModel()

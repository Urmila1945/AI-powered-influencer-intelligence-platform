import numpy as np
import xgboost as xgb

class GrowthPredictionModel:
    def __init__(self):
        self.model = xgb.XGBRegressor(objective='reg:squarederror', random_state=42)
        self._trained = False

    def train_dummy(self):
        # Dummy data
        # Features: [followers, monthly_growth, engagement]
        X_dummy = np.array([
            [50000, 12, 6.8],
            [10000, 5, 3.2],
            [200000, 2, 1.5]
        ])
        # Target: [growth_score (0-100), predicted_followers_90_days]
        # We will simplify by training one regressor for score and calculating followers manually, 
        # or training multiple. For now, let's return a score directly and calculate followers.
        y_dummy = np.array([88, 50, 30])
        self.model.fit(X_dummy, y_dummy)
        self._trained = True

    def predict(self, followers, monthly_growth, engagement):
        if not self._trained:
            self.train_dummy()
            
        X_input = np.array([[followers, monthly_growth, engagement]])
        growth_score = self.model.predict(X_input)[0]
        
        # Bound score between 0 and 100
        growth_score = max(0, min(100, int(growth_score)))
        
        # Predict followers 90 days out: 
        # followers + (followers * (monthly_growth / 100.0) * 3 months)
        predicted_followers_90_days = int(followers * (1 + (monthly_growth / 100.0) * 3))
        
        return {
            "growth_score": growth_score,
            "predicted_followers_90_days": predicted_followers_90_days
        }

growth_model = GrowthPredictionModel()

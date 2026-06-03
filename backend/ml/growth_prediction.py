import numpy as np

class DummyRegressor:
    def fit(self, X, y):
        pass
    def predict(self, X):
        return [50.0] * len(X)

class GrowthPredictionModel:
    def __init__(self):
        self.model = DummyRegressor()
        self._trained = False

    def train_dummy(self):
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

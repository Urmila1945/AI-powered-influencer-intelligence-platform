import numpy as np
from sklearn.ensemble import RandomForestRegressor

class InfluencerScoreModel:
    def __init__(self):
        # Using Random Forest as suggested in the Hackathon Track 1 prompt
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self._trained = False
        
        self.feature_names = [
            "engagement_rate", 
            "growth_rate", 
            "audience_quality", 
            "posting_consistency", 
            "comment_quality"
        ]

    def _train_dummy(self):
        # Dummy data based on the requested features
        # [engagement, growth, aqi, consistency, comment_quality]
        X = np.array([
            [12.5, 8.2, 95, 90, 85],   # Top tier
            [5.5, 3.1, 70, 60, 65],    # Mid tier
            [1.2, 0.5, 45, 40, 30],    # Low tier
            [8.0, 5.0, 85, 80, 75],    # High tier
            [3.0, 1.0, 50, 50, 40]     # Below avg
        ])
        # Target: Overall Ratefluencer Score (0-100)
        y = np.array([94, 75, 45, 82, 58])
        
        self.model.fit(X, y)
        self._trained = True

    def calculate_score(self, features):
        """
        Calculate the Ratefluencer score with a Machine Learning model.
        features: dict containing sub-scores (0-100) and percentages
        """
        if not self._trained:
            self._train_dummy()
            
        # Extract features (defaulting to 50 if missing)
        eng = features.get("engagement", 5.0)
        growth = features.get("growth_potential", 5.0)
        aqi = features.get("audience_quality", 50)
        cons = features.get("consistency", 60)
        comm_qual = features.get("comment_quality", 60)
        
        X_input = np.array([[eng, growth, aqi, cons, comm_qual]])
        
        # Predict the overall Ratefluencer Score
        score = self.model.predict(X_input)[0]
        score = max(0, min(100, score))
        
        explanations = [
            "Score predicted using Random Forest Regressor",
            f"Key drivers: Engagement ({eng}%), Growth ({growth}%)",
            f"Audience Quality: {aqi}, Consistency: {cons}"
        ]
            
        return {
            "score": round(score),
            "explanation": explanations
        }
        
    def aggregate_score(self, youtube_score, instagram_score):
        """Multi-platform Scoring"""
        return round((youtube_score * 0.6) + (instagram_score * 0.4))

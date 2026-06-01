class InfluencerScoreModel:
    def __init__(self):
        # Weights
        self.weights = {
            "authenticity": 0.30,
            "engagement": 0.25,
            "growth_potential": 0.20,
            "audience_quality": 0.15,
            "brand_relevance": 0.10
        }

    def calculate_score(self, features):
        """
        Calculate the Ratefluencer score with Explainable AI.
        features: dict containing sub-scores (0-100)
        """
        score = 0
        explanations = []
        for key, weight in self.weights.items():
            val = features.get(key, 0)
            added_pts = val * weight
            score += added_pts
            explanations.append(f"Added {round(added_pts, 1)} pts from {key.replace('_', ' ').title()} (Weight: {weight*100}%)")
            
        return {
            "score": round(score),
            "explanation": explanations
        }
        
    def aggregate_score(self, youtube_score, instagram_score):
        """Bonus 10: Multi-platform Scoring"""
        return round((youtube_score * 0.6) + (instagram_score * 0.4))

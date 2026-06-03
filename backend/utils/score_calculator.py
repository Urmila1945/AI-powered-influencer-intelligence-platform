from ml.influencer_score_model import InfluencerScoreModel

# We initialize a single instance to be used across the app
ml_score_model = InfluencerScoreModel()

class ScoreCalculator:
    @staticmethod
    def calculate_viralmind_score(authenticity, engagement, growth, audience_quality, brand_relevance):
        """
        Calculates the ViralMind Score using the Machine Learning Random Forest Model.
        """
        # Normalize engagement (assuming 0-20% is typical, max 20% maps to 100)
        norm_engagement = min(100, (engagement / 20.0) * 100)
        
        # Prepare features for the ML model
        features = {
            "engagement": norm_engagement,
            "growth_potential": growth,
            "audience_quality": audience_quality,
            "consistency": authenticity,     # Approximating consistency with authenticity for now
            "comment_quality": brand_relevance # Approximating with brand relevance
        }
        
        result = ml_score_model.calculate_score(features)
        return int(result["score"])

score_calculator = ScoreCalculator()

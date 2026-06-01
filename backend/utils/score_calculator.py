class ScoreCalculator:
    @staticmethod
    def calculate_ratefluencer_score(authenticity, engagement, growth, audience_quality, brand_relevance):
        """
        Calculates the Ratefluencer Score.
        Formula:
        30% Authenticity
        25% Engagement (Normalized to 0-100 first)
        20% Growth
        15% Audience Quality
        10% Brand Relevance
        """
        # Normalize engagement (assuming 0-20% is typical, max 20% maps to 100)
        norm_engagement = min(100, (engagement / 20.0) * 100)
        
        score = (
            (0.30 * authenticity) +
            (0.25 * norm_engagement) +
            (0.20 * growth) +
            (0.15 * audience_quality) +
            (0.10 * brand_relevance)
        )
        return int(score)

score_calculator = ScoreCalculator()

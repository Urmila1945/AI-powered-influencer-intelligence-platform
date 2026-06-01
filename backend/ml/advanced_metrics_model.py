import random

class AdvancedMetricsModel:
    def __init__(self):
        pass

    def calculate_audience_quality(self, authenticity_score, engagement_rate):
        """
        Bonus 3: Audience Quality Index
        """
        # Heuristic calculation for MVP
        aqi = (authenticity_score * 0.7) + (min(engagement_rate, 10.0) / 10.0 * 30.0)
        return round(aqi)

    def calculate_viral_potential(self, recent_growth_spikes, engagement_velocity):
        """
        Bonus 4: Viral Potential Score
        """
        # Heuristic calculation for MVP
        potential = (recent_growth_spikes * 15) + (engagement_velocity * 10)
        return min(100, max(0, potential))

    def calculate_creator_risk(self, authenticity_score):
        """
        Bonus 5: Creator Risk Score
        Lower is better. High risk = bad.
        """
        # Inverse of authenticity for a basic risk metric
        risk = 100 - authenticity_score
        # Add random modifier for controversy/brand safety simulation
        risk += random.randint(-5, 15)
        return min(100, max(0, risk))

advanced_metrics = AdvancedMetricsModel()

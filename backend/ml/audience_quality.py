class AudienceQualityIndex:
    @staticmethod
    def calculate(engagement_quality, comment_quality, consistency):
        """
        Calculate Audience Quality Index (AQI Score).
        All inputs expected to be 0-100.
        """
        # Weighted average formula for Audience Quality Index
        # Engagement Quality: 40%
        # Comment Quality: 40%
        # Consistency: 20%
        aqi_score = (engagement_quality * 0.4) + (comment_quality * 0.4) + (consistency * 0.2)
        return max(0, min(100, int(aqi_score)))

audience_quality_index = AudienceQualityIndex()

class AuthenticityModel:
    def __init__(self):
        # We would initialize a scikit-learn IsolationForest or similar here
        pass

    def detect_fake_engagement(self, follower_following_ratio, engagement_rate, like_comment_ratio, growth_spikes):
        """
        Detects fake followers and bot activity.
        """
        reasons = []
        risk_level = "Low"
        score = 100

        if follower_following_ratio < 1.5:
            reasons.append("Suspiciously high following count relative to followers")
            score -= 20
        
        if engagement_rate > 15.0 or engagement_rate < 0.5:
            reasons.append("Abnormal engagement rate (too high or too low)")
            score -= 25
            
        if like_comment_ratio > 100:
            reasons.append("Very few comments compared to likes (potential like-botting)")
            score -= 15
            
        if growth_spikes > 3:
            reasons.append("Unnatural follower growth spikes detected")
            score -= 15

        if score < 50:
            risk_level = "High"
        elif score < 75:
            risk_level = "Medium"
        else:
            if not reasons:
                reasons.append("Natural growth")
                reasons.append("High comment quality")

        return {
            "authenticity_score": score,
            "risk_level": risk_level,
            "reasons": reasons
        }

authenticity_detector = AuthenticityModel()

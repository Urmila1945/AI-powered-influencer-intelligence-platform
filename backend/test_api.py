import unittest
from app import create_app

class RatefluencerApiTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.testing = True
        self.client = self.app.test_client()

    def test_health_check(self):
        response = self.client.get('/health')
        self.assertEqual(response.status_code, 200)

    def test_authenticity_score(self):
        payload = {
            "followers": 100000,
            "engagement_rate": 5.5,
            "comment_quality": 80,
            "growth_rate": 12
        }
        response = self.client.post('/api/authenticity-score', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn('authenticity_score', response.get_json())

    def test_growth_prediction(self):
        payload = {
            "followers": 50000,
            "monthly_growth": 12,
            "engagement": 6.8
        }
        response = self.client.post('/api/growth-prediction', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn('growth_score', response.get_json())
        
    def test_campaign_predictor(self):
        payload = {
            "engagement": 6.5,
            "followers": 120000,
            "brand": "Samsung"
        }
        response = self.client.post('/api/campaign-predictor', json=payload)
        self.assertEqual(response.status_code, 200)
        
    def test_brand_match(self):
        payload = {
            "creator_bio": "Tech videos gadgets",
            "creator_category": "Tech"
        }
        response = self.client.post('/api/brand-match', json=payload)
        self.assertEqual(response.status_code, 200)
        
    def test_ratefluencer_score(self):
        payload = {
            "authenticity_score": 90,
            "engagement": 5.0,
            "growth_score": 85,
            "audience_quality": 80,
            "brand_relevance": 90
        }
        response = self.client.post('/api/ratefluencer-score', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn('ratefluencer_score', response.get_json())
        
if __name__ == '__main__':
    unittest.main()

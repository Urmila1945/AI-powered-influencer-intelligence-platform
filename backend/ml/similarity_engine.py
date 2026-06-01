from sentence_transformers import SentenceTransformer, util

class SimilarityEngine:
    def __init__(self):
        # Initialize SentenceTransformer model
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def encode(self, text):
        return self.model.encode(text)

    def find_similar_brands(self, creator_bio, creator_category, brands_db):
        """
        brands_db: list of dicts [{"brand": "Samsung", "description": "..."}, ...]
        """
        query_text = f"{creator_category} - {creator_bio}"
        query_embedding = self.encode(query_text)
        
        brand_embeddings = [self.encode(b['description']) for b in brands_db]
        
        results = []
        for i, brand in enumerate(brands_db):
            score = util.cos_sim(query_embedding, brand_embeddings[i]).item()
            results.append({
                "brand": brand['brand'],
                "score": int(score * 100)
            })
            
        # Sort by score descending
        results = sorted(results, key=lambda x: x['score'], reverse=True)
        return results

    def find_similar_creators(self, creator_bio, other_creators):
        """
        other_creators: list of dicts [{"username": "A", "bio": "..."}, ...]
        """
        query_embedding = self.encode(creator_bio)
        
        creator_embeddings = [self.encode(c.get('bio', '')) for c in other_creators]
        
        results = []
        for i, creator in enumerate(other_creators):
            score = util.cos_sim(query_embedding, creator_embeddings[i]).item()
            results.append({
                "creator": creator['username'],
                "score": int(score * 100)
            })
            
        results = sorted(results, key=lambda x: x['score'], reverse=True)
        return results[:5]

similarity_engine = SimilarityEngine()

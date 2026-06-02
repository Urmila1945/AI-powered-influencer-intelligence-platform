import difflib

class SimilarityEngine:
    def __init__(self):
        # We replace the heavy sentence-transformers with a lightweight difflib SequenceMatcher
        # to prevent server startup crashes and slow boot times caused by HuggingFace Hub downloads.
        pass

    def get_similarity_score(self, text1, text2):
        if not text1 or not text2:
            return 0
        return int(difflib.SequenceMatcher(None, text1.lower(), text2.lower()).ratio() * 100)

    def find_similar_brands(self, creator_bio, creator_category, brands_db=None):
        if not brands_db:
            brands_db = [
                {"brand": "Samsung", "description": "Tech electronics mobile phones gadgets"},
                {"brand": "Nike", "description": "Sports apparel shoes fitness"},
                {"brand": "Loreal", "description": "Beauty makeup cosmetics skincare"},
                {"brand": "Sony", "description": "Tech gaming consoles entertainment"},
                {"brand": "Red Bull", "description": "Energy drinks extreme sports gaming"}
            ]

        results = []
        target = f"{creator_category} {creator_bio}"
        
        for brand in brands_db:
            score = self.get_similarity_score(target, brand.get('description', ''))
            # Boost score based on exact category matches
            if creator_category.lower() in brand.get('description', '').lower():
                score = min(100, score + 40)
                
            results.append({
                "brand": brand['brand'],
                "similarity_score": score / 100.0  # Float between 0 and 1
            })

        results.sort(key=lambda x: x['similarity_score'], reverse=True)
        return results[:3]

    def find_similar_creators(self, creator_bio, creators_list):
        if not creators_list:
            return []

        results = []
        for creator in creators_list:
            score_int = self.get_similarity_score(creator_bio, creator.get('bio', ''))
            results.append({
                "username": creator.get('username'),
                "similarity_score": score_int / 100.0  # Float between 0 and 1
            })

        results.sort(key=lambda x: x['similarity_score'], reverse=True)
        return results[:3]

similarity_engine = SimilarityEngine()

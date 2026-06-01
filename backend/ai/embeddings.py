from sentence_transformers import SentenceTransformer
import numpy as np

class BrandEmbeddings:
    def __init__(self):
        # Using all-MiniLM-L6-v2 as specified
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def get_embedding(self, text):
        return self.model.encode(text)

    def calculate_similarity(self, emb1, emb2):
        # Cosine similarity
        return np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))

embedder = BrandEmbeddings()

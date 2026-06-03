from sentence_transformers import SentenceTransformer
import numpy as np

class BrandEmbeddings:
    def __init__(self):
        self.model = None

    def _load_model(self):
        if self.model is None:
            print("Loading embedding model...")
            self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def get_embedding(self, text):
        self._load_model()
        return self.model.encode(text)

    def calculate_similarity(self, emb1, emb2):
        return np.dot(emb1, emb2) / (
            np.linalg.norm(emb1) * np.linalg.norm(emb2)
        )

embedder = BrandEmbeddings()

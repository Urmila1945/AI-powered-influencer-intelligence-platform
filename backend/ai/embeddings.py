class BrandEmbeddings:
    def __init__(self):
        self.model = None

    def _load_model(self):
        pass

    def get_embedding(self, text):
        return [0.0] * 384

    def calculate_similarity(self, emb1, emb2):
        return 0.99

embedder = BrandEmbeddings()

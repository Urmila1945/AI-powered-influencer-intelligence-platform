# test_huggingface.py

from sentence_transformers import SentenceTransformer

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

embedding = model.encode(
    "Artificial Intelligence"
)

print(len(embedding))
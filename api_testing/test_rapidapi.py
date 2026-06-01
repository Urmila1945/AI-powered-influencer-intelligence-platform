# test_rapidapi.py

import requests
from dotenv import load_dotenv
import os

load_dotenv()

url = "YOUR_ENDPOINT"

headers = {
    "X-RapidAPI-Key":
    os.getenv("RAPIDAPI_KEY")
}

response = requests.get(
    url,
    headers=headers
)

print(response.json())
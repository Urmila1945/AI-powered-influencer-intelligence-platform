# test_apify.py

from apify_client import ApifyClient
from dotenv import load_dotenv
import os

load_dotenv()

client = ApifyClient(
    os.getenv("APIFY_TOKEN")
)

print(client.user().get())
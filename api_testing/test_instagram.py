# test_instagram.py

from apify_client import ApifyClient
from dotenv import load_dotenv
import os

load_dotenv()

client = ApifyClient(
    os.getenv("APIFY_TOKEN")
)

run_input = {
    "usernames": ["techburner"]
}

run = client.actor(
    "apify/instagram-profile-scraper"
).call(
    run_input=run_input
)

for item in client.dataset(
    run.default_dataset_id
).iterate_items():
    print(item)
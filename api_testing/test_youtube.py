# test_youtube.py

from googleapiclient.discovery import build
from dotenv import load_dotenv
import os

load_dotenv()

youtube = build(
    "youtube",
    "v3",
    developerKey=os.getenv("YOUTUBE_API_KEY")
)

request = youtube.channels().list(
    part="statistics",
    forHandle="MrBeast"
)

response = request.execute()

print(response)
import requests
import time

BASE_URL = "http://localhost:5000"

endpoints = [
    {"method": "GET", "url": "/health", "payload": None},
    {"method": "POST", "url": "/api/influencer/analyze", "payload": {"platform": "youtube", "username": "techburner"}},
    {"method": "GET", "url": "/api/influencer/top-creators", "payload": None},
    {"method": "POST", "url": "/api/scoring/viralmind-score", "payload": {"username": "techburner"}},
    {"method": "POST", "url": "/api/scoring/authenticity", "payload": {"username": "techburner"}},
    {"method": "POST", "url": "/api/scoring/insights", "payload": {"username": "techburner"}},
    {"method": "POST", "url": "/api/analytics/growth-prediction", "payload": {"username": "techburner"}},
    {"method": "GET", "url": "/api/analytics/trends?username=techburner", "payload": None},
    {"method": "POST", "url": "/api/brand/match", "payload": {"username": "techburner", "content_category": "Technology and Gadgets"}},
    {"method": "POST", "url": "/api/brand/campaign-success", "payload": {"username": "techburner", "brand": "Samsung"}},
    {"method": "POST", "url": "/api/bonus/compare", "payload": {"influencer1": "techburner", "influencer2": "mkbhd"}},
    {"method": "POST", "url": "/api/bonus/advanced-metrics", "payload": {"authenticity_score": 90, "engagement_rate": 8.0}},
    {"method": "POST", "url": "/api/bonus/brand-heatmap", "payload": {}},
    {"method": "POST", "url": "/api/bonus/simulator", "payload": {"current_followers": 1000000, "months": 6}},
    {"method": "POST", "url": "/api/bonus/similar", "payload": {"username": "techburner"}}
]

print("Waiting for server to start (this might take a moment if downloading ML models)...")
server_up = False
for _ in range(30):
    try:
        if requests.get(f"{BASE_URL}/health").status_code == 200:
            server_up = True
            break
    except requests.exceptions.ConnectionError:
        time.sleep(2)

if not server_up:
    print("[FAIL] Server did not start in time.")
    exit(1)

print("Server is up. Starting API tests...")
all_passed = True

for ep in endpoints:
    url = f"{BASE_URL}{ep['url']}"
    try:
        if ep["method"] == "GET":
            response = requests.get(url)
        else:
            response = requests.post(url, json=ep["payload"])
        
        if response.status_code == 200:
            print(f"[PASS] {ep['method']} {ep['url']} - Status 200")
        else:
            print(f"[FAIL] {ep['method']} {ep['url']} - Failed with status {response.status_code}")
            all_passed = False
    except requests.exceptions.ConnectionError:
        print(f"[FAIL] {ep['method']} {ep['url']} - Connection Error")
        all_passed = False

if all_passed:
    print("\n[SUCCESS] All tests passed successfully!")
else:
    print("\n[WARNING] Some tests failed.")

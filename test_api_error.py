import urllib.request, urllib.error, json
req = urllib.request.Request('https://viralmind-backend-1.onrender.com/api/auth/register', method='POST', headers={'Content-Type': 'application/json'}, data=json.dumps({'email':'b@b.com', 'password':'p', 'name':'n'}).encode())
try:
    resp = urllib.request.urlopen(req)
    print(resp.read().decode())
except urllib.error.HTTPError as e:
    print(e.read().decode())

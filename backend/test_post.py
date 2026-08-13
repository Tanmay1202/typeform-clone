import requests

resp = requests.post("http://localhost:8000/api/forms/", json={"title": "Test from py", "workspace_id": 1})
print("STATUS:", resp.status_code)
print("BODY:", resp.text)

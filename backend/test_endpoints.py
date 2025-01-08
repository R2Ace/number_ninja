# test_endpoints.py
import requests # type: ignore

def test_registration():
    url = 'http://localhost:5000/api/register'
    data = {
        'username': 'Jalina',  # One of your top players
        'email': 'jaline@example.com',
        'password': 'test123'
    }
    
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_registration()
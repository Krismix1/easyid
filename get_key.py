import requests
import json

def request_token():
    URL = 'https://w3certified.com/easyid/signup.php'
    myobj = {'email': 'postman@em.dk'}

    res = requests.post(URL, data=myobj)
    if res.status_code == 200:
        data = json.loads(res.text)
        return data['key']
    else:
        return None


if __name__ == '__main__':
    request_token()

import jwt
from flask import request, Flask

public_key = '/home/cristi/education/university/software-development/2nd-semester/system-integration/projects/easyid-1/auth/jwtRS256.key.pub'

with open(public_key, 'r') as f:
    public_key = f.read()

app = Flask(__name__)

@app.route('/users')
def users():
    auth_token = request.headers.get('Authorization', None)
    if not auth_token:
        return {
            'err': 'No authorization token'
        }
    try:
        decoded = jwt.decode(auth_token, public_key)
    except jwt.exceptions.DecodeError as e:
        return {
            'err': f'Invalid token: {e}'
        }
    print(decoded)
    return 'Hello, World!'

if __name__ == '__main__':
    app.run()

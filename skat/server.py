import jwt
import json
from flask import request, Flask

public_key = '/home/cristi/education/university/software-development/2nd-semester/system-integration/projects/easyid-1/auth/jwtRS256.key.pub'

with open(public_key, 'r') as f:
    public_key = f.read()

db_path = 'accounts.json'
db = {}
with open(db_path) as f:
    db = json.loads(f.read())

app = Flask(__name__)

@app.route('/loans')
def loans():
    auth_token = request.headers.get('Authorization', None)
    if not auth_token:
        return {
            'message': 'No authorization token',
            'status': 401
        }
    try:
        decoded = jwt.decode(auth_token, public_key)
    except jwt.exceptions.DecodeError as e:
        return {
            'message': f'Invalid token: {e}',
            'status': 401
        }
    email = decoded.get('email')
    if not email:
        return {
            'status': 500,
            'message': 'Email not provided'
        }
    if not email in db:
        return {
            'status': 400,
            'message': 'No user with this email'
        }

    loan = db[email]['loan']
    if loan > 0:
        msg = f'You owe us {loan} DKK.'
    elif loan == 0:
        msg = f'You don\'t have anything to return or gain.'
    else:
        msg = f'We need to return you {loan} DKK.'

    return {
        'message': msg,
        'status': 0
    }

if __name__ == '__main__':
    app.run(port=5051)

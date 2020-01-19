import jwt
import json
from flask import request, Flask

import repository

public_key = 'jwtRS256.key.pub'

with open(public_key, 'r') as f:
    public_key = f.read()

app = Flask(__name__)

@app.route('/accounts')
def account():
    auth_token = request.headers.get('Authorization', None)
    if not auth_token:
        return {
            'message': 'No authorization token',
            'status': 401
        }
    if not auth_token.startswith('Bearer '):
        return {
            'message': 'Invalid Bearer token format',
            'status': 401
        }
    try:
        decoded = jwt.decode(auth_token.split()[-1], public_key)
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
    if not repository.account_exists(email):
        return {
            'status': 400,
            'message': 'No user with this email'
        }
    # Not really atomic... the account could've been deleted in the mean time
    acc = repository.account_by_email(email)
    return {
        'message': f'You have {acc.amount} DKK in your account.',
        'status': 0
    }

if __name__ == '__main__':
    app.run()

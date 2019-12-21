import { SignOptions, sign } from 'jsonwebtoken'

const users: {
  [email: string]: { password: string}
} = {
  'a@a.com': { 'password': '1' },
  'b@a.com': { 'password': '2' }
}
const defaultOptions: SignOptions = { algorithm: 'RS256' }

export class AuthService {
  private key: string
  private options: SignOptions = {}

  constructor(privateKey: string, options: SignOptions = {}) {
    this.key = privateKey
    this.options = options
  }

  login (username: string, password: string): Promise<string> {
    const mixedOptions: SignOptions = { ...defaultOptions, ...this.options }

    if(users[username] && users[username].password === password) {
      return new Promise((resolve, reject) => {
        sign({ email: username }, this.key, mixedOptions, (err, token) => {
          if (err) {
            return reject(err)
          }
          return resolve(token)
        })
      })
    }
    return Promise.reject('Email or password is wrong')
  }
}

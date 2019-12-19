const jwt = require('jsonwebtoken')
const data = require('./users.json')

const defaultOptions = { algorithm: 'RS256' }

module.exports = (privateKey, options = {}) => ({
  login: (username, password) => {
    const mixedOptions = {...defaultOptions, ...options}

    if (data[username] && data[username].password === password) {
      return new Promise((resolve, reject) => {
        jwt.sign({ email: username }, privateKey, mixedOptions, (err, token) => {
          if (err) {
            return reject(err)
          }
          return resolve(token)
        })
      })
    }
    return Promise.reject('Email or password is wrong')
  }
})

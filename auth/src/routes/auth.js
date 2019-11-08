const jwt = require('jsonwebtoken')
const data = require('./users.json')

const defaultOptions = { algorithm: 'RS256' }

module.exports = (privateKey, options = {}) => (req, res) => {
  const mixedOptions = {...defaultOptions, ...options}

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).send({
      message: 'Email or password not provided',
      status: 1
    })
  }

  if (data[email] && data[email].password === password) {
    return jwt.sign({ email }, privateKey, mixedOptions, (err, token) => {
      const data = {
        token,
        status: 0
      }
      return res.status(200).send(data)
    })
  } else {
    return res.status(401).send({
      message: 'Email or password is wrong',
      status: 1
    })
  }


}

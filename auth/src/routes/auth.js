const jwt = require('jsonwebtoken')

const defaultOptions = { algorithm: 'RS256' }

module.exports = (privateKey, options = {}) => (req, res) => {
  const mixedOptions = {...defaultOptions, ...options}

  jwt.sign({ name: 'Alice' }, privateKey, mixedOptions, (err, token) => {
    const data = {
      message: 'You will be authenticated soon',
      token
    }
    return res.status(200).send(data)
  })
}

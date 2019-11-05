
const jwt = require('jsonwebtoken')
const token = jwt.sign({ name: 'Alice' }, 'mysecretkey')
console.log(token)

module.exports = (req, res) => {
  const data = {
    message: 'You will be authenticated soon',
    token
  }
  return res.status(200).send(data)
}

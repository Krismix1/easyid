const express = require('express')
const bodyParser = require('body-parser')

const fs = require('fs')
const createAuth = require('./routes/auth.js')

const privateKey = fs.readFileSync('jwtRS256.key')
const authHandler = createAuth(privateKey)

const app = express()
app.use(bodyParser.json())
const port = 42069

app.get('/', require('./routes/index.js'))
app.get('/identify', require('./routes/identify.js'))
app.post('/auth', authHandler)

app.listen(port, err => {
  if (err) {
    console.log(`Error when starting server on port ${port}: ${err}`)
    return
  }
  console.log(`Server listening on port ${port}`)
})

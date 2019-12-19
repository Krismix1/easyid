const express = require('express')
const bodyParser = require('body-parser')

const fs = require('fs')
const path = require('path')
// const createAuth = require('./routes/auth.js')
const createAuthService = require('./services/auth-service.js')

const privateKey = fs.readFileSync('jwtRS256.key')
// const authHandler = createAuth(privateKey)
const authService = createAuthService(privateKey)

const jsonMimeResHandler = (req, res, next) => {
    if (!res.getHeader('Content-Type')) {
        res.set('Content-Type', 'application/json')
    }
    return next()
}

const app = express()
app.use(bodyParser.json())
app.use(jsonMimeResHandler)
app.use(bodyParser.urlencoded({ extended: true }))
const port = 42069

const loginRequests = {}

// app.post('/auth', authHandler)

app.post('/login-request', (req, res) => {
  // TODO: Would also be good to save which company created the request
  const { successUrl, cancelUrl } = req.body
  const id = parseInt(Math.random() * 1000)
  loginRequests[id] = { successUrl, cancelUrl }
  const data = {
    redirectUrl: `http://localhost:${port}/login?request-id=${id}`
  }
  console.log(id, loginRequests)
  return res.status(200).send(data)
})

app.get('/login', (req, res) => {
  res.set('Content-Type', 'text/html')
  return res.status(200).sendFile(path.join(__dirname, 'pages', 'login.html'))
})

app.post('/login', (req, res) => {
  // TODO: Check if the request was already handled?
  const { requestId, email, password } = req.body
  console.log(requestId, loginRequests)
  if (!loginRequests[requestId]) {
    return res.status(400).send({
      status: 1,
      message: 'Request ID was not found'
    })
  }

  if (!email || !password) {
    return res.status(400).send({
      message: 'Email or password not provided',
      status: 1
    })
  }

  return authService.login(email, password)
    .then(token => {
      const url = loginRequests[requestId].successUrl
      delete loginRequests[requestId]
      return `${url}?token=${token}`
    })
    .catch(error => {
      console.log(error)
      const url = loginRequests[requestId].cancelUrl
      // update the information about the request so that the caller can fetch it
      loginRequests[requestId] = {
        error: true,
        data: {
          error
        }
      }
      return `${url}?request-id=${requestId}`
    })
    // a hackish way to redirect the browser
    .then(url => res.status(301).set('Location', url).send())
})

app.listen(port, err => {
  if (err) {
    console.log(`Error when starting server on port ${port}: ${err}`)
    return
  }
  console.log(`Server listening on port ${port}`)
})

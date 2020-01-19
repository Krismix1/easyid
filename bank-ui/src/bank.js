const express = require('express')
const axios = require('axios')

const path = require('path')

const jsonMimeResHandler = (req, res, next) => {
  if (!res.getHeader('Content-Type')) {
    res.set('Content-Type', 'application/json')
  }
  return next()
}

const app = express()
app.use(jsonMimeResHandler)
const port = 9999

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html')
  return res
    .status(200)
    .set('Cache-Control', 'no-store')
    .sendFile(path.join(__dirname, 'pages', 'index.html'))
})

app.get('/login', async (req, res) => {
  const { redirectUrl } = await axios({
    url: 'http://localhost:42069/login-request',
    method: 'POST',
    data: {
      successUrl: `http://localhost:${port}/success`,
      cancelUrl: `http://localhost:${port}/cancel`
    }
  }).then(res => res.data)

  return res
    .status(301)
    .set('Location', redirectUrl)
    .set('Cache-Control', 'no-store')
    .send()
})

app.get('/success', async (req, res) => {
  const { token } = req.query
  const data = await axios({
    url: 'http://localhost:5000/accounts',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.data)
  res.set('Content-Type', 'text/html')
  return res.status(200).send(`<h2>You have logged in. Your bank account information:</h2><p>${data.message}</p>`)
})
app.get('/cancel', (req, res) => {
  res.set('Content-Type', 'text/html')
  return res.status(200).send('<h2>You failed to login</h2>')
})


app.listen(port, err => {
  if (err) {
    console.log(`Error when starting server on port ${port}: ${err}`)
    return
  }
  console.log(`Server listening on port ${port}`)
})

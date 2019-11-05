const express = require('express')

const app = express()
const port = 42069

app.get('/', require('./routes/index.js')())
app.get('/identify', require('./routes/identify.js'))
app.get('/auth', require('./routes/auth.js'))

app.listen(port, err => {
  if (err) {
    console.log(`Error when starting server on port ${port}: ${err}`)
    return
  }
  console.log(`Server listening on port ${port}`)
})

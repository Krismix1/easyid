import * as express from 'express'
import * as bodyParser from 'body-parser'
import { Request, Response, NextFunction } from 'express-serve-static-core'
import * as fs from 'fs'
import * as path from 'path'
import { AuthService } from './services/auth-service'


const privateKey = fs.readFileSync('jwtRS256.key')
const authService = new AuthService(privateKey.toString())
const jsonMimeResHandler = (req: Request, res: Response, next: NextFunction) => {
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

interface LoginRequest {
  successUrl: string
  cancelUrl: string
  error: boolean
  data: {
    error: Error
  } | null
}

const loginRequests: {
  [id: number]: LoginRequest
} = {}


app.post('/login-request', (req: Request, res: Response) => {
  // TODO: Would also be good to save which company created the request
  const { successUrl, cancelUrl } = req.body
  const id = Math.floor(Math.random() * 1000)
  loginRequests[id] = { successUrl, cancelUrl, error: false, data: null }
  const data = {
    redirectUrl: `http://localhost:${port}/login?request-id=${id}`
  }
  return res.status(200).send(data)
})

app.get('/login', (req: Request, res: Response) => {
  res.set('Content-Type', 'text/html')
  return res.status(200).sendFile(path.join(__dirname, 'pages', 'login.html'))
})

app.post('/login', (req: Request, res: Response) => {
  // TODO: Check if the request was already handled?
  const { requestId, email, password } = req.body
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
    .catch((error: Error) => {
      console.log(error)
      const url = loginRequests[requestId].cancelUrl
      // update the information about the request so that the caller can fetch it
      loginRequests[requestId] = {
        ...loginRequests[requestId],
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

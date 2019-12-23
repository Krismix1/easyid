import * as fs from 'fs'
import { AuthService } from './services/auth-service'
import { App } from './app'
import { LoginRequestController } from './controllers/login-request-controller'

const privateKey = fs.readFileSync('jwtRS256.key')
const authService = new AuthService(privateKey.toString())

const port = 42069
const app = new App(
  [
    new LoginRequestController(authService, `http://localhost:${port}`)
  ],
  port
)

app.listen()

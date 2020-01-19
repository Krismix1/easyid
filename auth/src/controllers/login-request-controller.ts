import { Controller } from '../app'
import { Request, Response, Router } from 'express'
import { AuthService } from '../services/auth-service'
import * as path from 'path'

interface LoginRequest {
  successUrl: string
  cancelUrl: string
  isError: boolean
  error: Error | null
}

export class LoginRequestController implements Controller {

  private routePath = '/login'
  private readonly loginRequests: {
    [id: number]: LoginRequest
  } = {}

  constructor(private authService: AuthService, private rootPath: string) {}

  initialize(router: Router): void {
    router.post('/login-request', this.createLoginRequest.bind(this))
    router.get(this.routePath, this.getLoginPage.bind(this))
    router.post(this.routePath, this.authorize.bind(this))
  }

  private createLoginRequest(req: Request, res: Response) {
    // TODO: Would also be good to save which company created the request
    const { successUrl, cancelUrl } = req.body
    const id = Math.floor(Math.random() * 1000)
    this.loginRequests[id] = { successUrl, cancelUrl, isError: false, error: null }
    const data = {
      redirectUrl: `${this.rootPath}${this.routePath}?request-id=${id}`,
    }
    return res.status(200).send(data)
  }

  private getLoginPage(req: Request, res: Response) {
    res.set('Content-Type', 'text/html')
    // FIXME: Find a better way to resolve file path...
    return res.status(200).sendFile(path.join(__dirname, '..', '..', '..', 'static', 'login.html'))
  }

  private async authorize(req: Request, res: Response)  {
    const { requestId, email, password } = req.body

    if (!email || !password) {
      return res.status(400).send({
        message: 'Email or password not provided',
        status: 1,
      })
    }

    // this could mean that either the request was already handled
    // or was never created
    if (!this.loginRequests[requestId]) {
      return res.status(400).send({
        status: 1,
        message: 'Request ID was not found',
      })
    }

    if (this.loginRequests[requestId].isError) {
      return res.status(422).send({
        status: 1,
        message: 'Request already resulted in error'
      })
    }

    let url: string

    try {
      const token = await this.authService.login(email, password)
      const successUrl = this.loginRequests[requestId].successUrl
      delete this.loginRequests[requestId]
      url = `${successUrl}?token=${token}`
    } catch (err) {
      const cancelUrl = this.loginRequests[requestId].cancelUrl
      // update the information about the request so that the caller can fetch it
      this.loginRequests[requestId] = {
        ...this.loginRequests[requestId],
        isError: true,
        error: err
      }
      url = `${cancelUrl}?request-id=${requestId}`
    }

    // a hackish way to redirect the browser
    return res
      .status(301)
      .set('Location', url)
      .send()
  }
}

import * as express from 'express'
import * as bodyParser from 'body-parser'
import { Request, Response, NextFunction, Router, Application } from 'express'

export interface Controller {
  initialize (router: Router): void
}

const jsonMimeResHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!res.getHeader('Content-Type')) {
    res.set('Content-Type', 'application/json')
  }
  return next()
}
const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`from IP ${req.ip} host ${req.hostname} => ${req.method} ${req.path}`)
  next()
}

export class App {
  private app: Application

  constructor(controllers: Controller[], private port = 42069) {
    this.app = express()

    this.initializeMiddlewares()
    this.initializeControllers(controllers)
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(jsonMimeResHandler)
    this.app.use(loggerMiddleware)
  }

  private initializeControllers(controllers: Controller[]) {
    const rootRouter = Router()
    controllers.forEach((controller) => {
      controller.initialize(rootRouter)
    })
    this.app.use('/', rootRouter)
  }

  listen() {
    this.app.listen(this.port, err => {
      if (err) {
        console.log(`Error when starting server on port ${this.port}: ${err}`)
        return
      }
      console.log(`Server listening on port ${this.port}`)
    })
  }
}

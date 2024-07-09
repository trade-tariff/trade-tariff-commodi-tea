import express, { type Express, type Request, type Response, type NextFunction } from 'express'
import createError, { type HttpError } from 'http-errors'
import * as Sentry from '@sentry/node'
import path from 'path'
import morgan from 'morgan'

import indexRouter from './routes/index'
import initEnvironment from './config/env'
import { httpRequestLoggingMiddleware, logger } from './config/logging'

initEnvironment()

const app: Express = express()
const isDev = app.get('env') === 'development'
const sentryDsn = process.env.SENTRY_DSN ?? ''
const _sentryEnv = process.env.SENTRY_ENVIRONMENT ?? ''
const port = process.env.PORT ?? 8080

async function loadDev (): Promise<void> {
  if (isDev) {
    app.use(morgan('dev'))
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await loadDev()
})()

if (sentryDsn !== '') {
  // Sentry.init({ dsn: sentryDsn, environment: sentryEnv })
  // app.use(Sentry.Handlers.requestHandler())
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404))
})

// Error handler
app.use(function (err: HttpError, _req: Request, res: Response, _next: NextFunction) {
  res.locals.message = err.message
  res.locals.error = isDev ? err : {}

  const statusCode = err.statusCode ?? 500

  if (isDev) {
    console.error(err)
    // In development, you can send the full error
    res.status(statusCode).contentType('application/json').json(
      {
        error: err,
        stack: err.stack
      }
    )
  } else {
    err.message = err.message ?? 'Internal Server Error'
    // In production, send a generic message
    Sentry.captureException(err)
    res.status(statusCode).json({ error: 'Internal Server Error' })
  }
})

app.listen(port, () => {
  logger.info(`Server listening on ${port}`)
})

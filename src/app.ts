import express, { type Express, type Request, type Response, type NextFunction } from 'express'
import createError, { type HttpError } from 'http-errors'
import path from 'path'
import favicon from 'serve-favicon'
import morgan from 'morgan'
import nunjucks from 'nunjucks'

import indexRouter from './routes/index'
import initEnvironment from './config/env'
import { httpRequestLoggingMiddleware, logger } from './config/logging'

initEnvironment()

const app: Express = express()
const isDev = app.get('env') === 'development'
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

app.set('view engine', 'njk')

app.use(favicon(path.join('public', 'favicon.ico')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/govuk', express.static('node_modules/govuk-frontend/dist/govuk'))
app.use('/assets', express.static('node_modules/govuk-frontend/dist/govuk/assets'))
app.use(express.static('public'))
app.use(httpRequestLoggingMiddleware())

const templateConfig: nunjucks.ConfigureOptions = {
  autoescape: true,
  watch: isDev,
  express: app,
  noCache: isDev
}

nunjucks.configure(
  [
    'node_modules/govuk-frontend/dist',
    'views'
  ],
  templateConfig
)
// app.use(express.static(path.join(__dirname, '../public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404))
})

// Error handler
app.use(function (err: HttpError, _req: Request, res: Response, _next: NextFunction) {
  res.locals.message = err.message
  res.locals.error = isDev ? err : {}

  const statusCode: number = err.statusCode
  res.status(statusCode)
  switch (statusCode) {
    case 404:
      res.render('404')
      break
    default:
      res.render('500')
  }
})

app.listen(port, () => {
  logger.info(`Server listening on ${port}`)
})

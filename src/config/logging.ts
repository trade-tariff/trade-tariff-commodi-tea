import { type Request, type Response } from 'express'
import morgan from 'morgan'
import winston from 'winston'

const skippedUserAgents = ['ELB-HealthChecker/2.0', 'Status-Checks']

function jsonFormat (tokens: morgan.TokenIndexer, req: Request, res: Response): string {
  return JSON.stringify({
    time: tokens.date(req, res, 'iso'),
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    'content-length': tokens.res(req, res, 'content-length'),
    referrer: tokens.referrer(req, res),
    'user-agent': tokens['user-agent'](req, res),
    body: req.body
  })
}

export function httpRequestLoggingMiddleware (): any {
  return morgan(
    jsonFormat as morgan.FormatFn,
    {
      skip: (req: Request, _res: Response) => {
        const userAgent = req.headers['user-agent'] ?? ''

        return skippedUserAgents.includes(userAgent)
      }
    }
  )
}

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { service: 'hub-backend' },
  transports: [
    new winston.transports.Console()
  ]
})

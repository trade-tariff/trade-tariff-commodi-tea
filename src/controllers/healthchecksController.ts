import { type Request, type Response } from 'express'
import fs from 'fs'
import path from 'path'
import { logger } from '../config/logging'

let revision = 'development'

try {
  revision = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'REVISION'), 'utf-8').trim()
} catch (e) {
  logger.error('Error reading revision:', e)
}

export class HealthchecksController {
  public show (_req: Request, res: Response): void {
    res.json({ git_sha1: revision })
  }

  public showz (_req: Request, res: Response): void {
    res.json({ git_sha1: revision })
  }
}

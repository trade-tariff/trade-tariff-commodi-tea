import { type Request, type Response } from 'express'
import fs from 'fs'
import path from 'path'

const revision = fs.readFileSync(path.join(__dirname, '..', '..', 'REVISION'), 'utf-8').trim()

export class HealthchecksController {
  public show (_req: Request, res: Response): void {
    res.json({ git_sha1: revision })
  }

  public showz (_req: Request, res: Response): void {
    res.json({ git_sha1: revision })
  }
}

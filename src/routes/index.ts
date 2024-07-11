import express, { type Request, type Response, type NextFunction } from 'express'

import { HealthchecksController } from '../controllers/healthchecksController'

const router = express.Router()
const healthchecksController = new HealthchecksController()

router.get('/healthcheck', (req, res) => { healthchecksController.show(req, res) })
router.get('/healthcheckz', (req, res) => { healthchecksController.showz(req, res) })

export default router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  res.json({ hello: 'world' })
})

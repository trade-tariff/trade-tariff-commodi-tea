import express, { type Request, type Response, type NextFunction } from 'express'

import { HealthchecksController } from '../controllers/healthchecksController'
import { IdentifyController } from '../controllers/identifyController'
import { ImproveController } from '../controllers/improveController'

const router = express.Router()
const healthchecksController = new HealthchecksController()
const identifyController = new IdentifyController()
const improveController = new ImproveController()

router.get('/healthcheck', (req, res) => { healthchecksController.show(req, res) })
router.get('/healthcheckz', (req, res) => { healthchecksController.showz(req, res) })
router.get('/confirmation', (req, res) => { res.render('confirmation') })

export default router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  res.render('index')
})

/* eslint-disable  @typescript-eslint/no-floating-promises */
router.get('/identify', (req, res) => { identifyController.show(req, res) })
router.post('/save', (req, res) => { identifyController.create(req, res) })
router.post('/improve', (req, res) => { improveController.show(req, res) })
router.post('/classify', (req, res) => { improveController.update(req, res) })
/* eslint-enable @typescript-eslint/no-floating-promises */

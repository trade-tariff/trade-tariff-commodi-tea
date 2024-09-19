import express, { type Request, type Response, type NextFunction } from 'express'
import { requiresAuth } from 'express-openid-connect'

import { IdentifyController } from '../controllers/identifyController'
import { ImproveController } from '../controllers/improveController'
import { LeaderboardController } from '../controllers/leaderBoardController'

const router = express.Router()
const identifyController = new IdentifyController()
const improveController = new ImproveController()
const leaderBoardController = new LeaderboardController()

const isProduction = (process.env.NODE_ENV ?? 'development') === 'production'

if (isProduction) {
  router.use(requiresAuth())
}

router.get('/confirmation', (req, res) => { res.render('confirmation') })

router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  res.render('index')
})

/* eslint-disable  @typescript-eslint/no-floating-promises */
router.get('/identifications/new', (req, res) => { identifyController.new(req, res) })
router.post('/identifications', (req, res) => { identifyController.create(req, res) })
router.get('/identifications/:id/improve', (req, res) => { improveController.show(req, res) })
router.post('/identifications/:id/improve', (req, res) => { improveController.update(req, res) })
router.get('/identifications/:id/improve/wrong', (req, res) => { improveController.showWrong(req, res) })
router.post('/identifications/:id/improve/wrong', (req, res) => { improveController.updateWrong(req, res) })
router.get('/leaderboard', (req, res) => { leaderBoardController.show(req, res) })
/* eslint-enable @typescript-eslint/no-floating-promises */

export default router

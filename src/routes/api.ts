import express from 'express'
import { Api } from '../controllers/api/identificationsController'
const identificationsController = new Api.IdentificationsController()
const router = express.Router()

/* eslint-disable  @typescript-eslint/no-floating-promises */
router.get('/identifications', (req, res) => { identificationsController.index(req, res) })
router.get('/identifications/:id', (req, res) => { identificationsController.get(req, res) })
/* eslint-enable @typescript-eslint/no-floating-promises */

export default router

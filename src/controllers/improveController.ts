import { type Request, type Response } from 'express'
import Identification from '../models/identification'
import { logger } from '../config/logging'
import { type CognitoUser, UserService } from '../services/userService'

export class ImproveController {
  public show (req: Request, res: Response): void {
    const identificationId = req.params.id
    const updateIdentificationPath = `/identifications/${identificationId}/improve`

    res.render('improve', { updateIdentificationPath })
  }

  public async update (req: Request, res: Response): Promise<void> {
    const user: CognitoUser = UserService.call(req)
    const identificationId = req.params.id
    const reason = req.body.reason

    logger.debug(`Updating identification ${identificationId} with reason ${reason}`)

    try {
      await Identification.update(
        {
          answer: {
            answer: 'no',
            answer_info: {
              reason
            }
          },
          state: 'completed'
        },
        {
          where: {
            id: identificationId,
            userId: user.userId
          }
        }
      )
      res.redirect('/confirmation')
    } catch (error) {
      logger.error(`Failed to update identification ${identificationId} with reason ${reason}`)
      logger.error(error)
      res.status(500)
      res.render('500')
    }
  }
}

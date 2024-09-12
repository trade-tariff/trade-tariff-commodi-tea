import { type Request, type Response } from 'express'
import Identification from '../models/identification'
import { logger } from '../config/logging'

export class ImproveController {
  public show (req: Request, res: Response): void {
    const identificationId = req.params.id
    const updateIdentificationPath = `/identifications/${identificationId}/improve`

    res.render('improve', { updateIdentificationPath })
  }

  public async update (req: Request, res: Response): Promise<void> {
    const identificationId = req.params.id
    const reason = req.body.reason

    logger.debug(`Updating identification ${identificationId} with reason ${reason}`)
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
          id: identificationId
        }
      }
    )

    res.redirect('/confirmation')
  }
}

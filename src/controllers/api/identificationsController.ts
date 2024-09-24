import { type Request, type Response } from 'express'
import Identification from '../../models/identification'
import { GetIdentificationsService } from '../../services/getIdentificationsService'
import { logger } from '../../config/logging'

export namespace Api {
  export class IdentificationsController {
    public async get (req: Request, res: Response): Promise<void> {
      const identificationId = req.params.id

      try {
        const identification = await Identification.findByPk(identificationId)

        if (identification === null) {
          res.status(404).json({
            message: 'Identification not found'
          })
        } else {
          res.status(200).json(identification?.toJson())
        }
      } catch (error) {
        res.status(400).json({
          message: 'Invalid Identification id'
        })
      }
    }

    public async index (req: Request, res: Response): Promise<void> {
      const service = new GetIdentificationsService()

      try {
        const identifications = await service.call(req)
        const serializedIdentifications = identifications.map((identification: Identification) => identification.toJson())

        logger.debug('Identifications:', serializedIdentifications)
        res.status(200).json(serializedIdentifications)
      } catch (error) {
        logger.error('Error retrieving identifications', error)
        res.status(400).json({
          message: 'Invalid Identification id'
        })
      }
    }
  }
}

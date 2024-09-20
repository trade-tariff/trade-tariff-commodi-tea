import { type Request, type Response } from 'express'
import { GoodsNomenclatureClient } from '../utils/goodsNomenclatureClient'
import { type Description, DescriptionSampler } from '../utils/descriptionsSampler'
import Identification from '../models/identification'
import { type CognitoUser, UserService } from '../services/userService'
import { logger } from '../config/logging'

export class IdentifyController {
  private readonly client: GoodsNomenclatureClient
  private sampler: DescriptionSampler | null = null

  constructor () {
    this.client = GoodsNomenclatureClient.build()
  }

  public async new (req: Request, res: Response): Promise<void> {
    const user: CognitoUser = UserService.call(req)

    logger.debug('User:', user)
    if (this.sampler === null) {
      this.sampler = await DescriptionSampler.build()
    }

    const description: Description = this.sampler.sample()
    const goodsNomenclature = await this.client.get(description)
    const session = req.session ?? {}
    session.sampleDescription = goodsNomenclature.sampleDescription

    res.render('identify', { goodsNomenclature })
  }

  public async create (req: Request, res: Response): Promise<void> {
    const user: CognitoUser = UserService.call(req)
    const session = req.session ?? {}
    const answer = req.body.answer
    let state: 'completed' | 'pending'

    if (answer === 'yes' || answer === 'maybe') {
      state = 'completed'
    } else {
      state = 'pending'
    }

    const newIdentification = await Identification.create({
      classifiedDescription: session.sampleDescription,
      classifiedDescriptionId: 12345,
      userId: user.userId,
      state,
      answer: {
        answer
      }
    })

    logger.debug('Identification:', newIdentification)

    if (answer === 'yes' || answer === 'maybe') {
      session.sampleDescription = null
      res.redirect('/confirmation')
    } else {
      res.redirect(`/identifications/${newIdentification.id}/improve`)
    }
  }
}

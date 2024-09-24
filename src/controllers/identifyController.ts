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
    const user: CognitoUser = await UserService.call(req)

    logger.debug('User:', user)
    if (this.sampler === null) {
      this.sampler = await DescriptionSampler.build()
    }

    const description: Description = this.sampler.sample()
    const goodsNomenclature = await this.client.get(description)
    const session = req.session ?? {}
    session.goodsNomenclature = goodsNomenclature

    res.render('identify', { goodsNomenclature })
  }

  public async create (req: Request, res: Response): Promise<void> {
    const user: CognitoUser = await UserService.call(req)
    const session = req.session ?? {}
    const answer = req.body.answer
    const errors = this.validateAnswer(req)
    let state: 'completed' | 'pending'

    if (errors.length > 0) {
      const goodsNomenclature = session.goodsNomenclature

      res.status(400).render('identify', { goodsNomenclature, errors })

      return
    }

    if (answer === 'yes' || answer === 'maybe') {
      state = 'completed'
    } else {
      state = 'pending'
    }

    const newIdentification = await Identification.create({
      classifiedDescription: session.goodsNomenclature.sampleDescription,
      classifiedDescriptionId: 12345,
      userId: user.userId,
      state,
      answer: {
        answer
      }
    })

    logger.debug('Identification:', newIdentification)

    if (answer === 'yes' || answer === 'maybe') {
      res.redirect('/confirmation')
    } else {
      res.redirect(`/identifications/${newIdentification.id}/improve`)
    }
  }

  private validateAnswer (req: Request): Array<{ text: string, href: string }> {
    const errors: Array<{ text: string, href: string }> = []
    const answer = req.body.answer

    if (answer !== 'yes' && answer !== 'no' && answer !== 'maybe') {
      errors.push(
        {
          text: 'Pick an option',
          href: '#answer'
        }
      )
    }

    return errors
  }
}

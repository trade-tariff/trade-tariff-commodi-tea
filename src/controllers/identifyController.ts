import { type Request, type Response } from 'express'
import { GoodsNomenclatureClient } from '../utils/goodsNomenclatureClient'
import { type Description, DescriptionSampler } from '../utils/descriptionsSampler'
import Identification from '../models/identification'
import { type CognitoUser, UserService } from '../services/userService'

export class IdentifyController {
  private readonly client: GoodsNomenclatureClient
  private sampler: DescriptionSampler | null = null

  constructor () {
    this.client = GoodsNomenclatureClient.build()
  }

  public async show (req: Request, res: Response): Promise<void> {
    const user: CognitoUser = UserService.call(req)

    console.log('User:', user)
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
    const user: CognitoUser = UserService.call(req)
    const session = req.session ?? {}
    const answer = req.body.correctCNCode
    const newIdentification = await Identification.create({
      classifiedDescription: session.goodsNomenclature.sampleDescription,
      classifiedDescriptionId: session.goodsNomenclature.goodsNomenclatureItemId,
      userId: user.userId,
      state: 'completed',
      answer: {
        answer
      }
    })

    if (answer === 'yes' || answer === 'maybe') {
      session.goodsNomenclature = []
      res.redirect('/confirmation')
    } else {
      session.newIdentificationId = newIdentification.id
      res.render('improve', { session })
    }
  }
}

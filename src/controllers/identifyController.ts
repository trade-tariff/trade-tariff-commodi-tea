import { type Request, type Response } from 'express'
import { GoodsNomenclatureClient } from '../utils/goodsNomenclatureClient'
import { type Description, DescriptionSampler } from '../utils/descriptionsSampler'
import Identification from '../models/identification'

export class IdentifyController {
  private readonly client: GoodsNomenclatureClient
  private sampler: DescriptionSampler | null = null

  constructor () {
    this.client = GoodsNomenclatureClient.build()
  }

  public async show (req: Request, res: Response): Promise<void> {
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
    const session = req.session ?? {}
    console.log(session.goodsNomenclature)
    if (req.body.correctCNCode === 'yes' || req.body.correctCNCode === 'maybe') {
      // save the answer
      await Identification.create({
        classifiedDescription: { request_description: session.goodsNomenclature.sampleDescription.request_description },
        classifiedDescriptionId: session.goodsNomenclature.goodsNomenclatureItemId,
        userId: 134,
        state: 'completed',
        answer: {
          correctCNCode: req.body.correctCNCode,
          code: session.goodsNomenclature.sampleDescription.code,
          score: session.goodsNomenclature.sampleDescription.score,
          request_digits: session.goodsNomenclature.sampleDescription.request_digits,
          normalised_code: session.goodsNomenclature.sampleDescription.normalised_code
        }
      })
      session.goodsNomenclature = []
      res.redirect('/confirmation')
    } else {
      res.redirect('/improve')
    }
  }
}

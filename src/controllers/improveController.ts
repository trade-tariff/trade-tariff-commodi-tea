import { type Request, type Response } from 'express'
import Identification from '../models/identification'

export class ImproveController {
  public show (req: Request, res: Response): void {
    if (req.body.reasonForNoCode === 'vague') {
      res.redirect('/confirmation')
    } else {
      const session = req.session ?? {}
      res.render('classify', { session })
    }
  }

  public async update (req: Request, res: Response): Promise<void> {
    const session = req.session ?? {}
    const newIdentificationId = session.newIdentificationId

    await Identification.update(
      {
        answer: {
          answer: 'no',
          code: req.body.correctedClassifiedCode
        }
      },
      {
        where: {
          id: newIdentificationId
        }
      }
    )

    session.goodsNomenclature = []
    res.redirect('/confirmation')
  }
}

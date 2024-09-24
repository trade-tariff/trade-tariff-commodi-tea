import { type Request, type Response } from 'express'
import { Sequelize } from 'sequelize'
import Identification from '../models/identification'
import User from '../models/User'
import { computeScore } from '../utils/leaderBoardScoreHelper'
import { LeaderboardPresenter } from '../presenters/leaderBoardPresenter'

export class LeaderboardController {
  public async show (_req: Request, res: Response): Promise<void> {
    const result = await Identification.findAll({
      include: [{
        model: User,
        attributes: [],
        required: true
      }],
      attributes: [
        [Sequelize.col('User.fullName'), 'fullName'],
        [Sequelize.col('Identification.userId'), 'userId'],
        'state',
        'answer',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'score']
      ],
      group: [
        Sequelize.col('User.fullName'),
        Sequelize.col('Identification.userId'),
        'state',
        'answer'
      ],
      order: [
        ['score', 'DESC']
      ],
      raw: true
    })
    const formattedData = LeaderboardPresenter.present(computeScore(result))
    res.render('leaderboard', { formattedData })
  }
}

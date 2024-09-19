import Identification from '../models/identification'
import { type Request } from 'express'
import { logger } from '../config/logging'
import { Op } from 'sequelize'

interface IdentificationFilter {
  state?: string
  created_at_ago?: number
  updated_at_ago?: number
  answer?: string
}

export class GetIdentificationsService {
  MAXIMUM_DAYS_AGO = 90

  async call (req: Request): Promise<Identification[]> {
    try {
      return await Identification.findAll({
        where: this.buildQuery(req)
      })
    } catch (error) {
      logger.error('Error retrieving identifications', error)
      return []
    }
  }

  private buildQuery (req: Request): any {
    const queryParamsFilter: IdentificationFilter = req.query.filter as IdentificationFilter
    const answer = queryParamsFilter.answer ?? ''
    const state = queryParamsFilter.state ?? ''
    const createdAtAgoDays = queryParamsFilter.created_at_ago ?? 0
    const updatedAtAgoDays = queryParamsFilter.updated_at_ago ?? 0

    const identificationSqlFilter = {
      ...this.buildAnswerQuery(answer),
      ...this.buildStateQuery(state),
      ...this.buildCreatedAtQuery(createdAtAgoDays),
      ...this.buildUpdatedAtQuery(updatedAtAgoDays)
    }

    return identificationSqlFilter
  }

  private buildAnswerQuery (answer: string): any {
    const answerOptions = ['yes', 'no', 'maybe']

    if (!answerOptions.includes(answer)) {
      return {}
    } else {
      return { 'answer.answer': answer }
    }
  }

  private buildStateQuery (state: string): any {
    const stateOptions = ['completed', 'pending']

    if (!stateOptions.includes(state)) {
      return {}
    } else {
      return { state }
    }
  }

  private buildCreatedAtQuery (daysAgo: number): any {
    if (daysAgo === 0 || daysAgo < 0 || daysAgo > this.MAXIMUM_DAYS_AGO) {
      return {}
    }

    const agoDate = new Date(new Date().setDate(new Date().getDate() - daysAgo))

    return { createdAt: { [Op.gte]: agoDate } }
  }

  private buildUpdatedAtQuery (daysAgo: number): any {
    if (daysAgo === 0 || daysAgo < 0 || daysAgo > this.MAXIMUM_DAYS_AGO) {
      return {}
    }

    const agoDate = new Date(new Date().setDate(new Date().getDate() - daysAgo))

    return { updatedAt: { [Op.gte]: agoDate } }
  }
}

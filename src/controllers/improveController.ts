import { type Attributes, type UpdateOptions } from 'sequelize'
import { type Request, type Response } from 'express'
import Identification from '../models/identification'
import { logger } from '../config/logging'
import { type CognitoUser, UserService } from '../services/userService'

export class ImproveController {
  public show (req: Request, res: Response): void {
    const identificationId = req.params.id
    const path = `/identifications/${identificationId}/improve`

    res.status(200).render('improve/reason', { path })
  }

  public async update (req: Request, res: Response): Promise<void> {
    const reason: string = req.body.reason ?? 'unknown'
    const id = req.params.id

    logger.info(`Updating identification ${id} with reason ${reason}`)
    if (reason === 'vague') {
      await this.handleVagueUpdate(req, res)
    } else if (reason === 'wrong') {
      const path = `/identifications/${id}/improve/wrong`

      res.redirect(path)
    } else {
      res.status(500).render('500')
    }
  }

  public showWrong (req: Request, res: Response): void {
    const identificationId = req.params.id
    const path = `/identifications/${identificationId}/improve/wrong`

    res.status(200).render('improve/code', { path })
  }

  public async updateWrong (req: Request, res: Response): Promise<void> {
    const id = req.params.id
    const filter = this.filterFrom(req)
    const code = req.body.code
    const errors = this.validateCode(req)
    const session = req.session ?? {} // suspect

    if (errors.length > 0) {
      const path = `/identifications/${id}/improve/wrong`

      logger.info(`Failed to update identification ${id} with reason wrong`)
      logger.info(`errors: ${JSON.stringify(errors)}`)
      logger.info(`session: ${JSON.stringify(session)}`)

      res.status(400).render('improve/code', { session, errors, path })

      return
    }

    const update: Partial<Attributes<Identification>> = {
      answer: { answer: 'no', answer_info: { reason: 'wrong', code } },
      state: 'completed'
    }

    try {
      await Identification.update(update, filter)
      res.redirect('/confirmation')
    } catch (error) {
      logger.error(`Failed to update identification ${id} with reason wrong`)
      logger.error(error)
      res.status(500).render('500')
    }
  }

  private async handleVagueUpdate (req: Request, res: Response): Promise<void> {
    const identificationId = req.params.id
    const update: Partial<Attributes<Identification>> = {
      answer: { answer: 'no', answer_info: { reason: 'vague' } },
      state: 'completed'
    }

    try {
      await Identification.update(update, this.filterFrom(req))
    } catch (error) {
      logger.error(`Failed to update identification ${identificationId} with reason vague`)
      logger.error(error)
      res.status(500).render('500')
      return
    }

    res.redirect('/confirmation')
  }

  private filterFrom (req: Request): UpdateOptions<Attributes<Identification>> {
    const user: CognitoUser = UserService.call(req)
    const id = req.params.id

    return { where: { id, userId: user.userId } }
  }

  private validateCode (req: Request): Array<{ text: string, href: string }> {
    const codeRegex = /^(\d{4}|\d{6}|\d{8}|\d{10})$/
    const errors: Array<{ text: string, href: string }> = []
    const code: string = req.body.code ?? ''

    if (code === '') {
      errors.push(
        {
          text: 'Enter a code',
          href: '#code'
        }
      )
    } else {
      if (!codeRegex.test(code)) {
        errors.push(
          {
            text: 'Code must be 4, 6, 8 or 10 digits',
            href: '#code'
          }
        )
      }
    }

    return errors
  }
}

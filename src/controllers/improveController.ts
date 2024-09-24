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
    const errors = this.validateReason(req)

    if (errors.length > 0) {
      const path = `/identifications/${id}/improve`

      res.status(400).render('improve/reason', { errors, path })

      return
    }

    if (reason === 'vague') {
      await this.handleVagueUpdate(req, res)
    } else if (reason === 'wrong') {
      res.redirect(`/identifications/${id}/improve/wrong`)
    } else {
      res.status(500).render('500')
    }
  }

  public showWrong (req: Request, res: Response): void {
    const identificationId = req.params.id
    const path = `/identifications/${identificationId}/improve/wrong`
    const session = req.session ?? {}

    res.status(200).render('improve/code', { session, path })
  }

  public async updateWrong (req: Request, res: Response): Promise<void> {
    const id = req.params.id
    const filter = await this.filterFrom(req)
    const code = req.body.code
    const errors = this.validateCode(req)
    const session = req.session ?? {} // suspect

    if (errors.length > 0) {
      const path = `/identifications/${id}/improve/wrong`

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
      await Identification.update(update, await this.filterFrom(req))
    } catch (error) {
      logger.error(`Failed to update identification ${identificationId} with reason vague`)
      logger.error(error)
      res.status(500).render('500')
      return
    }

    res.redirect('/confirmation')
  }

  private async filterFrom (req: Request): Promise<UpdateOptions<Attributes<Identification>>> {
    const user: CognitoUser = await UserService.call(req)
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
          text: 'Enter a valid code',
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

  private validateReason (req: Request): Array<{ text: string, href: string }> {
    const errors: Array<{ text: string, href: string }> = []
    const reason: string = req.body.reason ?? ''

    if (reason === '') {
      errors.push(
        {
          text: 'Pick an option',
          href: '#reason'
        }
      )
    }

    return errors
  }
}

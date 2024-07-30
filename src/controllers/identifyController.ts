import { type Request, type Response } from 'express'

export const identifyPage = (req: Request, res: Response): void => {
  res.render('identifyPage')
}

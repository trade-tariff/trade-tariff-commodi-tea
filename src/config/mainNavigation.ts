import { type NextFunction, type Response } from 'express'

export default function (req: any, res: Response, next: NextFunction): void {
  const mainNavigation: any = []
  const isAuthenticated: boolean = req.oidc?.isAuthenticated() ?? false

  if (isAuthenticated) {
    mainNavigation.push({
      href: '/',
      text: 'Home'
    })
    mainNavigation.push({
      href: '/leaderboard',
      text: 'Leaderboard'
    })
    mainNavigation.push({
      href: '/logout',
      text: 'Sign Out'
    })
  } else {
    mainNavigation.push({
      href: '/',
      text: 'Home'
    })
    mainNavigation.push({
      href: '/leaderboard',
      text: 'Leaderboard'
    })
  }

  res.locals.mainNavigation = mainNavigation

  next()
};

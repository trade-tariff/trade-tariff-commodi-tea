export interface CognitoUser {
  userId: string
  email: string
  emailVerified: boolean
  username: string
}

export namespace UserService {
  export function call (req: any): CognitoUser {
    const env = process.env.NODE_ENV ?? 'development'
    const userProfile = req.appSession?.userProfile ?? null

    console.debug('req.appSession =>' + JSON.stringify(req.appSession))
    console.debug('req.appSession =>' + req.appSession)
    console.dir('req.appSession =>' + req.appSession)
    console.dir('req.appSession =>' + JSON.stringify(req.appSession))
    console.info('req.appSession =>' + JSON.stringify(req.appSession))
    console.info('req.appSession =>' + req.appSession)

    console.log('userProfile =>' + userProfile)
    if (userProfile === null) {
      if (env === 'production') throw new Error('User Profile is null, are you signed in?')

      return {
        userId: 'local-development',
        email: '',
        emailVerified: true,
        username: 'local-development'
      }
    }

    if (req.oidc.isAuthenticated() === false) if (env === 'production') throw new Error('User not authenticated')

    const userId = userProfile.sub ?? ''
    const email = userProfile.email
    const emailVerified = userProfile.email_verified
    const username = userProfile.username

    if (userId === '') throw new Error('User sub not set')
    if (email === '') throw new Error('Email not set')

    return { userId, email, emailVerified, username }
  }
}

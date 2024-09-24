import { logger } from '../config/logging'
import User from '../models/User'

export interface CognitoUser {
  userId: string
  email: string
  emailVerified: boolean
  username: string
  familyName: string
  name: string

}

export namespace UserService {
  export async function call (req: any): Promise<CognitoUser> {
    const env = process.env.NODE_ENV ?? 'development'
    const userProfile = req.appSession?.userProfile ?? null

    logger.debug('req.appSession =>' + req.appSession)
    logger.debug('userProfile =>' + userProfile)

    if (userProfile === null) {
      if (env === 'production') throw new Error('User Profile is null, are you signed in?')

      const user: CognitoUser = {
        userId: 'local-development',
        email: '',
        emailVerified: true,
        username: 'local-development',
        familyName: 'Doe',
        name: 'Joe'
      }

      return await handleUserProfile(user)
    }

    if (req.oidc.isAuthenticated() === false) if (env === 'production') throw new Error('User not authenticated')

    const userId = userProfile.sub ?? ''
    const email = userProfile.email
    const emailVerified = userProfile.email_verified
    const username = userProfile.username
    const familyName = userProfile.family_name ?? ''
    const name = userProfile.name

    if (userId === '') throw new Error('User sub not set')
    if (email === '') throw new Error('Email not set')

    const user = {
      userId,
      email,
      emailVerified,
      username,
      familyName,
      name
    }

    return await handleUserProfile(user)
  }

  async function handleUserProfile (userProfile: CognitoUser): Promise<CognitoUser> {
    await handleDbUser(userProfile)

    return userProfile
  }

  async function handleDbUser (userProfile: CognitoUser): Promise<void> {
    logger.debug('Calling handleDbUser')
    try {
      const now = new Date()
      const result = await User.findOrCreate({
        where: { userId: userProfile.userId },
        defaults: {
          userId: userProfile.username,
          email: userProfile.email,
          fullName: userProfile.name + ' ' + userProfile.familyName,
          createdAt: now,
          updatedAt: now
        }
      })
      logger.debug('handleDbUser: ', result)
    } catch (error) {
      logger.error('Error in saving the user details', error)
    }
  }
}

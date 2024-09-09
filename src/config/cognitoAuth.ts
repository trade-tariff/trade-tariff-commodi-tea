import { type RequestHandler } from 'express'
import { auth } from 'express-openid-connect'
import { logger } from '../config/logging'

interface ScpConfiguration {
  middleware: RequestHandler
  baseURL: string
}

export const configureAuth = (): ScpConfiguration => {
  const issuerBaseURL = process.env.COGNITO_OPEN_ID_ISSUER_BASE_URL ?? undefined
  const clientID = process.env.COGNITO_OPEN_ID_CLIENT_ID ?? undefined
  const clientSecret = process.env.COGNITO_OPEN_ID_CLIENT_SECRET ?? undefined
  const secret = process.env.COGNITO_OPEN_ID_SECRET ?? undefined
  const callback = process.env.COGNITO_OPEN_ID_CALLBACK_PATH ?? undefined
  const audience = process.env.COGNITO_OPEN_ID_BASE_URL ?? undefined

  if (issuerBaseURL === undefined) throw new Error('COGNITO_OPEN_ID_ISSUER_BASE_URL undefined.')
  if (clientID === undefined) throw new Error('COGNITO_OPEN_ID_CLIENT_ID undefined.')
  if (clientSecret === undefined) throw new Error('COGNITO_OPEN_ID_CLIENT_SECRET undefined.')
  if (secret === undefined) throw new Error('COGNITO_OPEN_ID_SECRET undefined.')
  if (callback === undefined) throw new Error('COGNITO_OPEN_ID_CALLBACK_PATH undefined.')
  if (audience === undefined) throw new Error('COGNITO_OPEN_ID_BASE_URL undefined.')
  const configuration = {
    baseURL: audience,
    issuerBaseURL,
    clientID,
    clientSecret,
    secret,
    idpLogout: true,
    routes: { callback },
    authorizationParams: {
      response_type: 'code',
      scope: 'openid profile',
      audience
    },
    authRequired: true,
    afterCallback: async (_req: any, _res: any, session: any, _decodedState: any) => {
      console.log('Session:', session)
      console.log(`${issuerBaseURL}/userinfo`)
      console.log(`Bearer ${session.access_token}`)
      try {
        const userProfileResponse = await fetch(`${issuerBaseURL}/userinfo`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        })

        if (!userProfileResponse.ok) {
          throw new Error('Failed to fetch user profile')
        }

        const userProfile = await userProfileResponse.json()

        return { ...session, userProfile }
      } catch (error) {
        logger.error('Error fetching user profile:', error)
        return session
      }
    }
  }
  console.log('Configuration:', configuration)
  const configuredAuth = auth(configuration)

  return {
    middleware: configuredAuth,
    baseURL: audience
  }
}

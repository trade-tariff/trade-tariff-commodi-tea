import { type RequestHandler } from 'express'
import { auth } from 'express-openid-connect'
import { logger } from '../config/logging'

interface CognitoConfiguration {
  middleware: RequestHandler
  baseURL: string
}

export const configureAuth = (): CognitoConfiguration => {
  const customDomain = process.env.COGNITO_OPEN_ID_CUSTOM_DOMAIN ?? undefined
  const issuerBaseURL = process.env.COGNITO_OPEN_ID_ISSUER_BASE_URL ?? undefined
  const clientID = process.env.COGNITO_OPEN_ID_CLIENT_ID ?? undefined
  const clientSecret = process.env.COGNITO_OPEN_ID_CLIENT_SECRET ?? undefined
  const secret = process.env.COGNITO_OPEN_ID_SECRET ?? undefined
  const callback = process.env.COGNITO_OPEN_ID_CALLBACK_PATH ?? undefined
  const audience = process.env.COGNITO_OPEN_ID_BASE_URL ?? undefined

  if (customDomain === undefined) throw new Error('COGNITO_OPEN_ID_CUSTOM_DOMAIN undefined.')
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
    logoutParams: {
      client_id: clientID,
      redirect_uri: audience,
      response_type: 'code'
    },
    routes: { callback },
    authorizationParams: {
      response_type: 'code',
      scope: 'openid profile',
      audience
    },
    authRequired: true,
    afterCallback: async (_req: any, _res: any, session: any, _decodedState: any) => {
      try {
        const url = `${customDomain}/oauth2/userinfo`
        logger.debug('Session:', session)
        logger.debug(`url: ${url}`)
        const userProfileResponse = await fetch(url, {
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
  logger.debug('Configuration:', configuration)
  const configuredAuth = auth(configuration)

  return {
    middleware: configuredAuth,
    baseURL: audience
  }
}

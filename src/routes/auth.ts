import express from 'express'
import axios from 'axios'
import qs from 'qs'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN
const CLIENT_ID = process.env.COGNITO_CLIENT_ID
const REDIRECT_URI = process.env.REDIRECT_URI
const LOGOUT_REDIRECT_URI = process.env.LOGOUT_REDIRECT_URI

const authUrl = `https://${COGNITO_DOMAIN}/oauth2/authorize`
const tokenUrl = `https://${COGNITO_DOMAIN}/oauth2/token`
// const logoutUrl = `https://${COGNITO_DOMAIN}/logout`

router.get('/login', (req, res) => {
  const url = `${authUrl}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid profile email`
  res.redirect(url)
})

router.get('/callback', async (req, res) => {
  const code = req.query.code as string

  try {
    const response = await axios.post(
      tokenUrl,
      qs.stringify({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        code
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    const { accessToken, idToken, refreshToken } = response.data

    if (req.session) {
      req.session.access_token = accessToken
      req.session.id_token = idToken
      req.session.refresh_token = refreshToken
    }

    // Redirect or send response after storing tokens
    res.json({ accessToken, idToken, refreshToken })
  } catch (error) {
    console.error('Token exchange error:', error)
    res.status(500).send('Error during token exchange')
  }
})

router.get('/logout', (req, res) => {
  const url = `${LOGOUT_REDIRECT_URI}`

  if (req.session) {
    req.session = null
    res.redirect(url)
  } else {
    res.redirect(url) // Even if session is not available, proceed to logout
  }
})

export default router

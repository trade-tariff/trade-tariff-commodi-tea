import express from 'express'
import axios from 'axios'
import qs from 'qs'

const router = express.Router()

const COGNITO_DOMAIN = 'auth.tea.dev.trade-tariff.service.gov.uk'
const CLIENT_ID = ''
const REDIRECT_URI = 'https://tea.dev.trade-tariff.service.gov.uk'
const LOGOUT_REDIRECT_URI = ''

const authUrl = `https://${COGNITO_DOMAIN}/oauth2/authorize`
const tokenUrl = `https://${COGNITO_DOMAIN}/oauth2/token`
const logoutUrl = `https://${COGNITO_DOMAIN}/logout`


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

        const { access_token, id_token, refresh_token } = response.data

        if (req.session) {
            req.session.access_token = access_token
            req.session.id_token = id_token
            req.session.refresh_token = refresh_token
        }

        // Redirect or send response after storing tokens
        res.json({ access_token, id_token, refresh_token })
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

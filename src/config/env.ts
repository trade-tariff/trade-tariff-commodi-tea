import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

export default function initEnvironment (): void {
  const environment = process.env.NODE_ENV ?? 'development'
  const envFilePath = path.join(process.cwd(), `.env.${environment}`)

  if (environment === 'production') {
    return
  }

  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath })
  } else {
    console.warn(`Environment file not found: ${envFilePath}`)
  }
}

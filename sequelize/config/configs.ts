import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const envVars = process.env as Record<string, string>

export const {
  DB_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  DB_HOST,
  POSTGRES_DB
} = envVars

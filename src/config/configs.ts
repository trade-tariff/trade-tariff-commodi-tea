import dotenv from 'dotenv'
import { type Options, type Dialect } from 'sequelize'

dotenv.config({ path: '.env' })

const envVars = process.env
const environment: string = envVars.NODE_ENV ?? 'development'
const username: string = envVars.POSTGRES_USER ?? envVars.USER ?? 'postgres'
const dialect: Dialect = 'postgres'
const database: string = envVars.POSTGRES_DB ?? `tea_${environment}`

interface CustomOptions extends Options {
  uri?: string
}

interface Configuration {
  development: CustomOptions
  test: CustomOptions
  production: CustomOptions
}

const localConfiguration: Options = {
  host: 'localhost',
  dialect,
  username,
  database
}

const configuration: Configuration = {
  development: localConfiguration,
  test: localConfiguration,
  production: {
    uri: envVars.DATABASE_URL ?? '',
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}

const config = configuration[environment as keyof Configuration]

export default config

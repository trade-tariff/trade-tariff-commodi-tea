import { type Options, type Dialect } from 'sequelize'

const envVars = process.env
const environment: string = envVars.NODE_ENV ?? 'development'

interface CustomOptions extends Options {
  uri?: string
  dialect?: Dialect
  username?: string
  password?: string
  database?: string
  dialectOptions?: {
    ssl: {
      require: boolean
      rejectUnauthorized: boolean
    }
  }
  fpoSearch: {
    baseUrl: string
    apiKey: string
  }
}

interface Configuration {
  development: CustomOptions
  test: CustomOptions
  production: CustomOptions
}

const localConfiguration: CustomOptions = {
  host: 'localhost',
  dialect: 'postgres' as Dialect,
  username: envVars.POSTGRES_USER ?? envVars.USER ?? 'postgres',
  password: envVars.POSTGRES_PASSWORD ?? '',
  database: envVars.POSTGRES_DB ?? `tea_${environment}`,
  fpoSearch: {
    baseUrl: envVars.FPO_SEARCH_BASE_URL ?? 'https://search.dev.trade-tariff.service.gov.uk/fpo-code-search',
    apiKey: envVars.FPO_SEARCH_API_KEY ?? ''
  }
}

const productionConfig: CustomOptions = {
  uri: envVars.DATABASE_URL,
  dialect: 'postgres' as Dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  fpoSearch: {
    baseUrl: envVars.FPO_SEARCH_BASE_URL ?? 'https://search.trade-tariff.service.gov.uk/fpo-code-search',
    apiKey: envVars.FPO_SEARCH_API_KEY ?? ''
  }
}

const configuration: Configuration = {
  development: localConfiguration,
  test: localConfiguration,
  production: productionConfig
}

const config = configuration[environment as keyof Configuration]

export default config

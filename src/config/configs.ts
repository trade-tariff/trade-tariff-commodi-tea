import { type Options, type Dialect } from 'sequelize'

const envVars = process.env
const environment: string = envVars.NODE_ENV ?? 'development'

// interface CustomOptions extends Options {
//   uri?: string,
//   fpoSearch: {
//     baseUrl: string,
//     apiKey: string,
//   }
// }

// interface Configuration {
//   development: CustomOptions
//   test: CustomOptions
//   production: CustomOptions
// }

// const localConfiguration: CustomOptions = {
//   host: 'localhost',
//   dialect,
//   username,
//   database,
//   fpoSearch: {
//     baseUrl: 'https://search.trade-tariff.service.gov.uk/fpo-code-search'
//   }
// }

const config = {
  sequelize: {
    uri: envVars.DATABASE_URL,
    host: envVars.DATABASE_HOST,
    dialect: 'postgres' as Dialect,
    username: envVars.POSTGRES_USER ?? envVars.USER ?? 'postgres',
    database: envVars.POSTGRES_DB ?? `tea_${environment}`,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  fpoSearch: {
    baseUrl: envVars.FPO_SEARCH_BASE_URL ?? 'https://search.trade-tariff.service.gov.uk/fpo-code-search',
    apiKey: envVars.FPO_SEARCH_API_KEY ?? '',
  }
}

export default config

// This file is used by the sequelize-cli to initialize the sequelize instance
// and follows a slightly different interface than the one used in the application (see connection.ts)

if (process.env.NODE_ENV !== 'production') {
  // This is needed to make the migrations work with typescript
  require('ts-node/register')
}
const config = require('./configs').default
let configuration
const environment = process.env.NODE_ENV ?? 'development'

if (environment === 'development' || environment === 'test') {
  configuration = {
    username: config.username,
    database: config.database,
    host: config.host,
    dialect: config.dialect
  }
} else {
  url = `${config.uri}?ssl=true`
  configuration = {
    url: url,
    dialect: config.dialect
  }
}

module.exports = configuration

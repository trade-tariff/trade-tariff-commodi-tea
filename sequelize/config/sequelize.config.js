require('ts-node/register');
const configs = require('./configs.ts');

module.exports = {
  username: configs.POSTGRES_USER,
  password: configs.POSTGRES_PASSWORD,
  database: configs.POSTGRES_DB,
  host: configs.DB_HOST,
  dialect: 'postgres',
  port: 5432
};

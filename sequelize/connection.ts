import { Sequelize } from 'sequelize'
import { POSTGRES_DB, DB_HOST, POSTGRES_PASSWORD, POSTGRES_USER } from './config/configs'

const sequelizeConnection: Sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  port: 5432
})

export default sequelizeConnection

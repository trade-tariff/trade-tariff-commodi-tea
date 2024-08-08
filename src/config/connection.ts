import { Sequelize } from 'sequelize'
import config from './configs'

let sequelizeConnection: Sequelize

if (config.uri !== undefined) {
  sequelizeConnection = new Sequelize(config.uri, config)
} else {
  sequelizeConnection = new Sequelize(config)
}

export default sequelizeConnection

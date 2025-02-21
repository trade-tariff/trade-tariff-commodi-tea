import { Sequelize } from 'sequelize'
import config from './configs'

let sequelizeConnection: Sequelize

if (config.sequelize.uri !== undefined) {
  sequelizeConnection = new Sequelize(config.sequelize.uri, config.sequelize)
} else {
  sequelizeConnection = new Sequelize(config.sequelize)
}

export default sequelizeConnection

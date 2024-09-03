import { Model, DataTypes } from 'sequelize'
import connection from '../config/connection'

class Identification extends Model {}

Identification.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  classifiedDescription: DataTypes.JSONB,
  classifiedDescriptionId: DataTypes.BIGINT,
  userId: DataTypes.BIGINT,
  state: DataTypes.ENUM('pending', 'completed'),
  answer: DataTypes.JSONB,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize: connection,
  modelName: 'Identification'
})

export default Identification

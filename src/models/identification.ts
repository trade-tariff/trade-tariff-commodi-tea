import { Model, DataTypes } from 'sequelize'
import connection from '../config/connection'

class Identification extends Model {
  id!: number
  classifiedDescription!: Record<string, unknown>
  classifiedDescriptionId!: number
  userId!: number
  state!: 'pending' | 'completed'
  answer!: Record<string, unknown>
  createdAt!: Date
  updatedAt!: Date
}

Identification.init({
  id: DataTypes.BIGINT,
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

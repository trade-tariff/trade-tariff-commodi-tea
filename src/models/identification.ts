import { Model, DataTypes } from 'sequelize'
import connection from '../config/connection'

class Identification extends Model {
  id?: number
  classifiedDescription?: object
  classifiedDescriptionId?: number
  userId?: string
  state?: string
  answer?: object
  createdAt?: Date
  updatedAt?: Date

  toJson (): any {
    return {
      id: this.id,
      classifiedDescription: this.classifiedDescription,
      classifiedDescriptionId: this.classifiedDescriptionId,
      userId: this.userId,
      state: this.state,
      answer: this.answer,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}

Identification.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  classifiedDescription: DataTypes.JSONB,
  classifiedDescriptionId: DataTypes.BIGINT,
  userId: DataTypes.STRING,
  state: DataTypes.ENUM('pending', 'completed'),
  answer: DataTypes.JSONB,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize: connection,
  modelName: 'Identification'
})

export default Identification

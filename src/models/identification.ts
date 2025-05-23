import { Model, DataTypes } from 'sequelize'
import connection from '../config/connection'
import User from './User'

class Identification extends Model {
  declare id?: number
  declare classifiedDescription?: object
  declare classifiedDescriptionId?: number
  declare userId?: string
  declare state?: string
  declare answer?: object
  declare createdAt?: Date
  declare updatedAt?: Date
  fullName?: string // This is presented as part of an aggregate query but does not exist in the model
  score?: number // This is presented as part of an aggregate query but does not exist in the model

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

Identification.belongsTo(User, {
  foreignKey: {
    name: 'userId'
  }
})

export default Identification

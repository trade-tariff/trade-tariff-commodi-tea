import { Model, DataTypes } from 'sequelize'
import connection from '../config/connection'

interface ClassificationAttributes {

  id?: number
  descriptionId: number
  description: string
  commodityCode: string
  updatedAt?: Date
  createdAt?: Date
}

class Classification extends Model<ClassificationAttributes> implements ClassificationAttributes {
  public id!: number
  public descriptionId!: number
  public description!: string
  public commodityCode!: string

  public readonly updatedAt!: Date
  public readonly createdAt!: Date
}

Classification.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    descriptionId: {
      allowNull: false,
      type: DataTypes.NUMBER
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING
    },
    commodityCode: {
      allowNull: false,
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    sequelize: connection,
    modelName: 'Classification'
  }
)

export default Classification

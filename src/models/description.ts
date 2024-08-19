import { Model, DataTypes } from 'sequelize'
import connection from '../config/connection'

interface DescriptionAttributes {

  id?: number
  description: string
  commodityCode: string
  updatedAt?: Date
  createdAt?: Date
}

class Description extends Model<DescriptionAttributes> implements DescriptionAttributes {
  public id!: number
  public description!: string
  public commodityCode!: string

  public readonly updatedAt!: Date
  public readonly createdAt!: Date
}

Description.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
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
    modelName: 'Description'
  }
)

export default Description

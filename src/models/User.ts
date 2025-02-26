import { Model, DataTypes } from 'sequelize'
import connection from '../config/connection'

class User extends Model {
}

User.init({
  userId: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
  },
  email: DataTypes.STRING,
  fullName: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize: connection,
  modelName: 'User'
})

export default User

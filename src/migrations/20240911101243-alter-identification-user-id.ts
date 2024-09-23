import { type QueryInterface, type DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    return await Promise.all([
      queryInterface.changeColumn('Identifications', 'userId', {
        type: Sequelize.STRING,
        allowNull: false
      })
    ])
  },

  async down (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    return await Promise.all([
      queryInterface.changeColumn('Identifications', 'userId', {
        type: Sequelize.BIGINT,
        allowNull: true
      })
    ])
  }
}

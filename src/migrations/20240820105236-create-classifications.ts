import { type QueryInterface, type DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('classifications', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID
      },
      descriptionId: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      commodityCode: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.dropTable('classifications')
  }
}

import { type QueryInterface, type DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable('Identifications', {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      classifiedDescription: {
        type: Sequelize.JSONB
      },
      classifiedDescriptionId: {
        type: Sequelize.BIGINT
      },
      userId: {
        type: Sequelize.BIGINT
      },
      state: {
        type: Sequelize.ENUM('pending', 'completed')
      },
      answer: {
        type: Sequelize.JSONB
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
  async down (queryInterface: QueryInterface, _Sequelize: any) {
    await queryInterface.dropTable('Identifications')
  }
}

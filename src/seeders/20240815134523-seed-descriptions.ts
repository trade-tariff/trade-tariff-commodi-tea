import { type QueryInterface, type Sequelize } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface, _sequelize: Sequelize) => {
    return await queryInterface.bulkInsert('descriptions', [
      {
        description: 'First Description',
        commodityCode: '12365485',
        updatedAt: new Date(),
        createdAt: new Date()
      },
      {
        description: 'Second Description',
        commodityCode: '96326145',
        updatedAt: new Date(),
        createdAt: new Date()
      }
    ])
  },

  down: async (queryInterface: QueryInterface, _sequelize: Sequelize) => {
    return await queryInterface.bulkDelete('descriptions', {}, {})
  }
}

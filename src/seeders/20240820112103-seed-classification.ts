import { type QueryInterface, type Sequelize } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface, _sequelize: Sequelize) => {
    return await queryInterface.bulkInsert('classifications', [
      {
        id: '40e6215d-b5c6-4896-987c-f30f3678f608',
        descriptionId: '12345',
        description: 'First Description',
        commodityCode: '98765432',
        updatedAt: new Date(),
        createdAt: new Date()
      },
      {
        id: '6ecd8c99-4036-403d-bf84-cf8400f67836',
        descriptionId: '56789',
        description: 'Second Description',
        commodityCode: '81238765',
        updatedAt: new Date(),
        createdAt: new Date()
      }
    ])
  },

  down: async (queryInterface: QueryInterface, _sequelize: Sequelize) => {
    return await queryInterface.bulkDelete('classifications', {}, {})
  }
}

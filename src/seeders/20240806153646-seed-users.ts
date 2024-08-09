import { type QueryInterface, type Sequelize } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface, _sequelize: Sequelize) => {
    return await queryInterface.bulkInsert('users', [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'password456',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface: QueryInterface, _sequelize: Sequelize) => {
    return await queryInterface.bulkDelete('users', {}, {})
  }
}

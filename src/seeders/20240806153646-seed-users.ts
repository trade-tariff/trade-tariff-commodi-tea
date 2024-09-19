import { type QueryInterface, type Sequelize } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface, _sequelize: Sequelize) => {
    return await queryInterface.bulkInsert('Users', [
      {
        userId: 'local-development',
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: '134',
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface: QueryInterface, _sequelize: Sequelize) => {
    return await queryInterface.bulkDelete('users', {}, {})
  }
}

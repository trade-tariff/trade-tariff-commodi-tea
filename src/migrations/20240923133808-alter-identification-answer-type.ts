import { type QueryInterface, type DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    return await Promise.all([
      queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.sequelize.query(
          `
          ALTER TABLE "Identifications" ALTER answer TYPE JSONB USING answer::JSONB
          `,
          { transaction }
        )
      })
    ])
  },

  async down (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    return await Promise.all([
      queryInterface.sequelize.transaction(async (transaction) => {
        await queryInterface.sequelize.query(
          `
          ALTER TABLE "Identifications" ALTER answer TYPE TEXT USING answer::TEXT
          `,
          { transaction }
        )
      })
    ])
  }
}

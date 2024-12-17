'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.query(`
    CREATE INDEX index_gaaid_parentid
    ON gaa_level_entries (gaa_hierarchy_id, parent_id)`)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.query(`
    DROP INDEX [IF EXISTS] index_gaaid_parentid
    ON gaa_level_entries`)

  }
};

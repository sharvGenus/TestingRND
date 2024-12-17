"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
		INSERT INTO all_masters_list (id, visible_name, access_flag, is_active) VALUES
			  ('a8bbb41a-57d4-443d-ac6c-784dc1f0d1cb','View Stores', 'true', '1')
        `);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query("DELETE FROM all_masters_list WHERE id IN ('a8bbb41a-57d4-443d-ac6c-784dc1f0d1cb')");
    }
};
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
		INSERT INTO all_masters_list (id, visible_name, access_flag, rank, parent_id, is_master, lov_access) VALUES
			  ('198d3ced-dd16-4f59-886a-b3d71cd43ec4','GAA & Network Area Allocation', 'true', 6, '8e3b6289-05f9-4324-9a8d-ed93fac47db3', false, false)
        `);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query("DELETE FROM all_masters_list WHERE id IN ('198d3ced-dd16-4f59-886a-b3d71cd43ec4')");
    }
};
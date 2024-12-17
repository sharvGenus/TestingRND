"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
		INSERT INTO all_masters_list (id, visible_name, access_flag, rank, parent_id, is_master, lov_access) VALUES
			  ('e5ecc3b9-531a-4c6d-9a5f-0ade0cfb2089','MDM Data Sync Report', 'true', 6, '8b682419-3d70-4c52-b229-c82b5559aec8', false, false)
        `);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query("DELETE FROM all_masters_list WHERE id IN ('e5ecc3b9-531a-4c6d-9a5f-0ade0cfb2089')");
    }
};
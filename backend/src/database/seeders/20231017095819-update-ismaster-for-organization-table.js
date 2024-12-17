"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
		UPDATE all_masters_list SET is_master=true WHERE id='4993b4e1-fe3a-4c84-9206-cddb3aee1dae';
		INSERT INTO all_master_columns (id, master_id, name, visible_name, is_active) VALUES
			  ('7b5cee77-ecbe-4f53-bcb1-a97b4a940bcb', '4993b4e1-fe3a-4c84-9206-cddb3aee1dae', 'name', 'Name', '1'),
			  ('0d3fa265-d395-4a09-9d30-772c6d0ae45c', '4993b4e1-fe3a-4c84-9206-cddb3aee1dae', 'organization_type_id', 'Organization Type ID','1');
        `);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query("UPDATE all_masters_list SET is_master=false WHERE id='4993b4e1-fe3a-4c84-9206-cddb3aee1dae'");
    }
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
		    INSERT INTO all_master_columns (id,master_id, name, visible_name, is_active) VALUES 
            ('8720d670-b073-4140-ac88-ed8f1724a129', '63dfdba2-8bbc-40ea-a934-f38e44d0d2ca', 'quantity', 'Quantity', '1')
		`);
    },
    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query("DELETE FROM all_master_columns WHERE id IN ('8720d670-b073-4140-ac88-ed8f1724a129')");
    }
};
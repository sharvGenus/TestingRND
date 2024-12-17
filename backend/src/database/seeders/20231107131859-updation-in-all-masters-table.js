"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
		INSERT INTO all_masters_list (id, parent_id, grand_parent_id, name, visible_name, master_route, access_flag, is_active) VALUES
			  ('57286d60-26cf-4fbe-8a2b-6067b2b5c845', 'bad5c521-fd62-4050-a7ed-6b95101f967f', '008a743f-e7df-4c2a-b9c2-c12682c90276', 'customer_to_project_site_store', 'Customer to Project Site Store(PTC)', '/customer-to-project-site-store', 'true', '1'),
        ('85fdc0a5-a842-4136-a823-5b5500a4d3ff', 'bad5c521-fd62-4050-a7ed-6b95101f967f', '008a743f-e7df-4c2a-b9c2-c12682c90276', 'consumption', 'Consumption', '/consumption', 'true', '1'),
        ('fe9d247b-860e-449d-aa8d-cd3203e64e3f', 'cdb1160b-b040-4ca7-beb2-49ea99e522f5', '008a743f-e7df-4c2a-b9c2-c12682c90276', 'consumption_request', 'Consumption Request', '/consumption-request', 'true', '1')
        `);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query("DELETE FROM all_masters_list WHERE id IN ('57286d60-26cf-4fbe-8a2b-6067b2b5c845', '85fdc0a5-a842-4136-a823-5b5500a4d3ff', 'fe9d247b-860e-449d-aa8d-cd3203e64e3f')");
    }
};
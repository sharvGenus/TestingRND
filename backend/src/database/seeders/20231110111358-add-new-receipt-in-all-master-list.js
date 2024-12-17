"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
		INSERT INTO all_masters_list (id, parent_id, grand_parent_id, name, visible_name, master_route, access_flag, is_active) VALUES
			  ('e35a48ac-f902-4ba4-bf99-820fb381a2e9', '52cf2db4-9467-4d78-a023-42a5026c0180', '008a743f-e7df-4c2a-b9c2-c12682c90276', 'cts_receipt', 'CTS Receipt', '/cts-receipt', 'true', '1'),
        ('82682fb0-638b-42e3-9def-c6525141629b', '52cf2db4-9467-4d78-a023-42a5026c0180', '008a743f-e7df-4c2a-b9c2-c12682c90276', 'consumption_request_receipt', 'Consumption Request Receipt', '/consumption-request-receipt', 'true', '1'),
        ('144e1702-9935-4f48-9668-dcb8b1a4f843', '52cf2db4-9467-4d78-a023-42a5026c0180', '008a743f-e7df-4c2a-b9c2-c12682c90276', 'consumption_receipt', 'Consumption Receipt', '/consumption-receipt', 'true', '1')
        `);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query("DELETE FROM all_masters_list WHERE id IN ('e35a48ac-f902-4ba4-bf99-820fb381a2e9', '82682fb0-638b-42e3-9def-c6525141629b', '144e1702-9935-4f48-9668-dcb8b1a4f843')");
    }
};
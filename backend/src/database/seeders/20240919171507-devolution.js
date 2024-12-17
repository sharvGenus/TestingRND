"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
		UPDATE all_masters_list SET is_master = false WHERE id = '2be0a457-8781-4a2d-b678-3310a9b3bd03';
        UPDATE all_masters_list SET name = 'devolution_configurator', is_master = false WHERE id = '197ea6e8-8780-4c82-aa7c-aad8b52a41f4';
        UPDATE all_masters_list SET name = 'create_devolution', is_master = false WHERE id = '68dd48d1-43e2-411a-936a-07b8f4c5c623';
        UPDATE all_masters_list SET name = 'devolution_view', is_master = false WHERE id = '650073ce-c01a-4c4f-9342-f0025166134b';
        UPDATE all_masters_list SET name = 'devolution_approver_dashboard', visible_name = 'Devolution Approver Dashboard', is_master = false WHERE id = '199ba2fa-a175-4b65-9f29-015a7e139d95';
        `);
    },
    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
		UPDATE all_masters_list SET is_master = true WHERE id = '2be0a457-8781-4a2d-b678-3310a9b3bd03';
        UPDATE all_masters_list SET name = 'devolution-configurator', is_master = true WHERE id = '197ea6e8-8780-4c82-aa7c-aad8b52a41f4';
        UPDATE all_masters_list SET name = 'create-devolution', is_master = true WHERE id = '68dd48d1-43e2-411a-936a-07b8f4c5c623';
        UPDATE all_masters_list SET name = 'devolution-view', is_master = true WHERE id = '650073ce-c01a-4c4f-9342-f0025166134b';
        UPDATE all_masters_list SET name = 'devolution-approver-dashboard', visible_name = 'Approver Dashboard', is_master = true WHERE id = '199ba2fa-a175-4b65-9f29-015a7e139d95';
        `);
    }
};
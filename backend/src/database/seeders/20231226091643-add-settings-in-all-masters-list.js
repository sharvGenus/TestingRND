"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
            UPDATE user_master_permissions set master_id = '7ac8a08a-c2e4-4661-af43-616460c76887' where master_id = 'd8715506-5f9b-42d9-b6cd-3a3784481174';
            UPDATE role_master_permissions set master_id = '7ac8a08a-c2e4-4661-af43-616460c76887' where master_id = 'd8715506-5f9b-42d9-b6cd-3a3784481174';
            UPDATE user_master_lov_permission set master_id = '7ac8a08a-c2e4-4661-af43-616460c76887' where master_id = 'd8715506-5f9b-42d9-b6cd-3a3784481174';
            UPDATE role_master_lov_permissions set master_id = '7ac8a08a-c2e4-4661-af43-616460c76887' where master_id = 'd8715506-5f9b-42d9-b6cd-3a3784481174';
            UPDATE user_master_column_permission set master_id = '7ac8a08a-c2e4-4661-af43-616460c76887' where master_id = 'd8715506-5f9b-42d9-b6cd-3a3784481174';
            UPDATE role_master_column_permission set master_id = '7ac8a08a-c2e4-4661-af43-616460c76887' where master_id = 'd8715506-5f9b-42d9-b6cd-3a3784481174';
            
            UPDATE all_masters_list SET rank = '9', grand_parent_id = null, parent_id = '654fb67d-edbc-4d7e-9848-dc41676cfc23' WHERE id = 'e0d9ee26-a93f-4886-a6fc-d085250dab95';
            UPDATE all_masters_list SET name = null, visible_name = 'Form Configurator', rank = '6', parent_id = null WHERE id = '7ac8a08a-c2e4-4661-af43-616460c76887';
            UPDATE all_masters_list SET name = null, visible_name = 'Form Responses', rank = '7', parent_id = null WHERE id = '65b01aaf-46ab-468c-b6bd-4fa72a2f089a';
            DELETE FROM all_masters_list WHERE id = 'd8715506-5f9b-42d9-b6cd-3a3784481174';
            UPDATE all_masters_list SET rank = '8' WHERE id = 'd8715506-5f9b-42d9-b6cd-3a3785481301';
            INSERT INTO all_masters_list (id, visible_name, access_flag, rank, is_master) values ('4657ce4c-59dd-4418-8e8c-2b4488892316', 'Settings', true, 9, false) ON CONFLICT (id) DO NOTHING;
            UPDATE all_masters_list SET rank = '1', parent_id = '4657ce4c-59dd-4418-8e8c-2b4488892316' WHERE id = 'e92fb325-ef46-43a7-83af-d69cb98e6090';
		`);
    },
    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
            INSERT INTO all_masters_list (id, visible_name, access_flag, rank, is_master) values ('d8715506-5f9b-42d9-b6cd-3a3784481174', 'Form Configurator', true, 6, false) ON CONFLICT (id) DO NOTHING;
            UPDATE all_masters_list SET rank = '5', grand_parent_id = '654fb67d-edbc-4d7e-9848-dc41676cfc23', parent_id = '7a345e62-6fc2-48c8-85e3-97d9bb5f7af4' WHERE id = 'e0d9ee26-a93f-4886-a6fc-d085250dab95';
            UPDATE all_masters_list SET rank = '7' WHERE id = 'd8715506-5f9b-42d9-b6cd-3a3785481301';
            UPDATE all_masters_list SET name = forms, visible_name = 'Forms', rank = '1', parent_id = 'd8715506-5f9b-42d9-b6cd-3a3784481174' WHERE id = '7ac8a08a-c2e4-4661-af43-616460c76887';
            UPDATE all_masters_list SET name = forms, visible_name = 'Responses', rank = '2', parent_id = 'd8715506-5f9b-42d9-b6cd-3a3784481174' WHERE id = '65b01aaf-46ab-468c-b6bd-4fa72a2f089a';
            UPDATE all_masters_list SET rank = '2', parent_id = '008a743f-e7df-4c2a-b9c2-c12682c90276' WHERE id = 'e92fb325-ef46-43a7-83af-d69cb98e6090';
            DELETE FROM all_masters_list WHERE id IN ('4657ce4c-59dd-4418-8e8c-2b4488892316');
        `);
    }
};

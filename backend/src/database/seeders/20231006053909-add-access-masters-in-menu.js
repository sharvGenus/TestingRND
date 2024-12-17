"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            "insert into all_masters_list (id,visible_name, access_flag, parent_id, grand_parent_id, master_route)  values ('63bc7083-5791-45eb-81c3-3eefe2f1660c','Menu & Masters', 'true', 'c2e618a9-815c-46eb-932d-2b3c5b222ba2', '8e3b6289-05f9-4324-9a8d-ed93fac47db3', '/menu-masters')"
        );

        await queryInterface.sequelize.query(
            "insert into all_masters_list (id,visible_name, access_flag, parent_id, grand_parent_id, master_route)  values ('302df318-e3ba-4d63-a809-4e9ec80bd8f8','Form Responses', 'true', 'c2e618a9-815c-46eb-932d-2b3c5b222ba2', '8e3b6289-05f9-4324-9a8d-ed93fac47db3', '/access-form-responses')"
        );
    }
};
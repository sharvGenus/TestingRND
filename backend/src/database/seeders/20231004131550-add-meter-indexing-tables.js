"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            "insert into all_masters_list (id,name, access_flag, visible_name, is_master)  values ('c6fb87f4-b45d-4ba8-b7a8-a87ec4953412','material_serial_numbers', 'true', 'Material List', true)"
        );

        await queryInterface.sequelize.query(
            "insert into all_master_columns (id, master_id, name, visible_name) values ('16011297-1e91-42a7-b532-b139470fd791','c6fb87f4-b45d-4ba8-b7a8-a87ec4953412', 'material_id', 'Material ID')"
        );

        await queryInterface.sequelize.query(
            "insert into all_master_columns (id, master_id, name , visible_name) values ('67ce0b45-7b9c-416f-9911-b3b75331625f', 'c6fb87f4-b45d-4ba8-b7a8-a87ec4953412', 'serial_number', 'Serial Number')"
        );
    }
};
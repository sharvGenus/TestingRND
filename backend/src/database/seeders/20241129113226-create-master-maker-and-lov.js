"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            update master_maker_lovs set name = 'Auto Locked' where id = '40e66f7e-4088-4bd1-a555-c5b867b101c9';
            delete from master_maker_lovs where master_id = '6ee88077-4674-47eb-8e02-9db23c8a6e52';
            delete from master_makers where id = '6ee88077-4674-47eb-8e02-9db23c8a6e52';
            update all_masters_list set visible_name = 'User Creation' where id = '4236c773-cb7e-4f33-821c-32338daa49dc';
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            "update master_maker_lovs set name = 'AutoDeleted' where id = '40e66f7e-4088-4bd1-a555-c5b867b101c9'"
        );
    }
};
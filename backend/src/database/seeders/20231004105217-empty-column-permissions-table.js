"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            "update users set role_id = null where id <> '577b8900-b333-42d0-b7fb-347abc3f0b5c'"
        );

        await queryInterface.sequelize.query(
            "delete from role_column_wise_permissions"
        );

        await queryInterface.sequelize.query(
            "delete from role_column_default_permissions"
        );

        await queryInterface.sequelize.query(
            "delete from user_column_wise_permissions"
        );

        await queryInterface.sequelize.query(
            "delete from user_column_default_permissions"
        );

        await queryInterface.sequelize.query(
            "delete from role_master_lov_permissions"
        );

        await queryInterface.sequelize.query(
            "delete from role_master_permissions"
        );

        await queryInterface.sequelize.query(
            "delete from roles where id <> 'a89c1591-ed87-40e5-b89b-e409d647e3e5'"
        );
    }
};
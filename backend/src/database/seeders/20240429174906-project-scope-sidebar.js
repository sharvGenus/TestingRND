"use strict";

const schemaName = "public";
const { ALL_MASTERS_LIST } = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        INSERT INTO
        ${schemaName}.${ALL_MASTERS_LIST} (
            id,
            name,
            visible_name,
            access_flag,
            created_at,
            updated_at,
            parent_id,
            is_master,
            lov_access,
            master_route,
            table_type,
            rank
        )
        VALUES
        (
            '3ebf78d9-0c38-4654-90a9-da418f4f0cdd',
            'project_scope',
            'Project Scope',
            true,
            '2024-04-29 14:43:50.892759+05:30',
            '2024-04-29 14:43:50.892759+05:30',
            '654fb67d-edbc-4d7e-9848-dc41676cfc23',
            false,
            false,
            '/project-scope',
            'table',
            12
        );`);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        DELETE FROM
        ${schemaName}.${ALL_MASTERS_LIST}
        WHERE id = '3ebf78d9-0c38-4654-90a9-da418f4f0cdd';`);
    }
};

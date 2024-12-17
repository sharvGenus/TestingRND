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
            '42215ba3-ecbe-46e9-b796-5afe76f07898',
            'project_summary_dashboard',
            'Project Summary Dashboard',
            false,
            '2023-12-26 21:43:50.892759+05:30',
            '2023-12-26 21:43:50.892759+05:30',
            '4a8b8d1b-52fe-4b55-aed7-de9bd2f59c7c',
            false,
            false,
            '/project-summary-dashboard',
            'table',
            3
        );`);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        DELETE FROM
        ${schemaName}.${ALL_MASTERS_LIST}
        WHERE id = '42215ba3-ecbe-46e9-b796-5afe76f07898';`);
    }
};

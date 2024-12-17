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
            'b5e80da6-f979-46ab-9f81-6933ed4f72a4',
            'daily_execution_plan',
            'Daily Execution Plan',
            true,
            '2024-05-08 20:43:50.892759+05:30',
            '2024-05-08 20:43:50.892759+05:30',
            '654fb67d-edbc-4d7e-9848-dc41676cfc23',
            false,
            false,
            '/daily-execution-plan',
            'table',
            13
        );`);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        DELETE FROM
        ${schemaName}.${ALL_MASTERS_LIST}
        WHERE id = 'b5e80da6-f979-46ab-9f81-6933ed4f72a4';`);
    }
};

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
            grand_parent_id,
            is_master,
            lov_access,
            master_route,
            table_type,
            rank
        )
        VALUES
        (
            'a1697d01-f17d-411d-8b02-8fa67f279674',
            'cancel_stsrc',
            'Cancel STSRC',
            true,
            '2024-05-15 11:43:50.892759+05:30',
            '2024-05-15 11:43:50.892759+05:30',
            'fbc6590f-0d94-43a8-9680-f1cca84e8540',
            '5fe301bb-4b9d-4ffa-95dd-c0ab0216071e',
            false,
            false,
            '/cancel-stsrc',
            'table',
            3
        ),
        (
            '4bf9fa60-4f5d-4c48-b0aa-b60375164709',
            'cancel_srcts',
            'Cancel SRCTS',
            true,
            '2024-05-15 11:43:50.892759+05:30',
            '2024-05-15 11:43:50.892759+05:30',
            '2cd4c64d-ef44-408f-a133-7c685bdb57b8',
            '5fe301bb-4b9d-4ffa-95dd-c0ab0216071e',
            false,
            false,
            '/cancel-srcts',
            'table',
            3
        );
        `);
        
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        DELETE FROM
        ${schemaName}.${ALL_MASTERS_LIST}
        WHERE id IN ('a1697d01-f17d-411d-8b02-8fa67f279674', '4bf9fa60-4f5d-4c48-b0aa-b60375164709');`);
    }
};

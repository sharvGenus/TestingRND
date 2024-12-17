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
            grand_parent_id,
            parent_id,
            is_master,
            master_route,
            rank
        )
        VALUES
        (
            '2be0a457-8781-4a2d-b678-3310a9b3bd03',
            'devolution',
            'Devolution',
            true,
            null,
            null,
            true,
            null,
            11
        ),
        (
            '197ea6e8-8780-4c82-aa7c-aad8b52a41f4',
            'devolution-configurator',
            'Devolution Configurator',
            true,
            null,
            '2be0a457-8781-4a2d-b678-3310a9b3bd03',
            true,
            '/devolution-configurator',
            1
        ),
        (
            '68dd48d1-43e2-411a-936a-07b8f4c5c623',
            'create-devolution',
            'Create Devolution',
            true,
            null,
            '2be0a457-8781-4a2d-b678-3310a9b3bd03',
            true,
            '/devolution',
            2
        ),
        (
            '650073ce-c01a-4c4f-9342-f0025166134b',
            'devolution-view',
            'Devolution View',
            true,
            null,
            '2be0a457-8781-4a2d-b678-3310a9b3bd03',
            true,
            '/devolution-view',
            3
        ),
        (
            '199ba2fa-a175-4b65-9f29-015a7e139d95',
            'devolution-approver-dashboard',
            'Approver Dashboard',
            true,
            null,
            '2be0a457-8781-4a2d-b678-3310a9b3bd03',
            true,
            '/devolution-approver-dashboard',
            4
        )
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        DELETE FROM
        ${schemaName}.${ALL_MASTERS_LIST}
        WHERE id IN (
        '2be0a457-8781-4a2d-b678-3310a9b3bd03',
        '197ea6e8-8780-4c82-aa7c-aad8b52a41f4',
        '68dd48d1-43e2-411a-936a-07b8f4c5c623',
        '650073ce-c01a-4c4f-9342-f0025166134b',
        '199ba2fa-a175-4b65-9f29-015a7e139d95'
        `);
    }
};

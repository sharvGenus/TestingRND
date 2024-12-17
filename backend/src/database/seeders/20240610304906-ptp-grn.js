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
            'f4bae3c5-ee88-4e12-b3e4-b23e16b20158',
            NULL,
            'Project To Project GRN (PTPGRN)',
            true,
            '2024-06-14 17:30:50.892759+05:30',
            '2024-06-14 17:30:50.892759+05:30',
            '5fe301bb-4b9d-4ffa-95dd-c0ab0216071e',
            '008a743f-e7df-4c2a-b9c2-c12682c90276',
            false,
            false,
            NULL,
            'table',
            22
        ),
        (
            '899e48fa-399c-4616-8058-5d6df001fb6a',
            'create_ptp_grn',
            'Create PTPGRN',
            true,
            '2024-06-14 17:31:50.892759+05:30',
            '2024-06-14 17:31:50.892759+05:30',
            'f4bae3c5-ee88-4e12-b3e4-b23e16b20158',
            '5fe301bb-4b9d-4ffa-95dd-c0ab0216071e',
            false,
            false,
            '/ptp-grn',
            'table',
            1
        ),
        (
            'a31111ae-487c-400a-9317-811ae40db80d',
            'ptp_grn_receipt',
            'PTPGRN Receipt',
            true,
            '2024-06-14 17:31:50.892759+05:30',
            '2024-06-14 17:31:50.892759+05:30',
            'f4bae3c5-ee88-4e12-b3e4-b23e16b20158',
            '5fe301bb-4b9d-4ffa-95dd-c0ab0216071e',
            false,
            false,
            '/ptp-grn-receipt',
            'table',
            2
        ),
        (
            '2e6f633e-3c66-4f86-b04a-8cea547eb285',
            'cancel_ptp_grn',
            'Cancel PTPGRN',
            true,
            '2024-06-14 17:31:50.892759+05:30',
            '2024-06-14 17:31:50.892759+05:30',
            'f4bae3c5-ee88-4e12-b3e4-b23e16b20158',
            '5fe301bb-4b9d-4ffa-95dd-c0ab0216071e',
            false,
            false,
            '/cancel-ptp-grn',
            'table',
            3
        );
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        DELETE FROM
        ${schemaName}.${ALL_MASTERS_LIST}
        WHERE id IN (
        'f4bae3c5-ee88-4e12-b3e4-b23e16b20158', 
        '899e48fa-399c-4616-8058-5d6df001fb6a', 
        'a31111ae-487c-400a-9317-811ae40db80d', 
        '2e6f633e-3c66-4f86-b04a-8cea547eb285'`);
    }
};

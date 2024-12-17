"use strict";

const {
    ALL_MASTERS_LIST,
    USER_MASTER_PERMISSIONS,
    USER_MASTER_LOV_PERMISSION,
    USER_MASTER_COLUMN_PERMISSION,
    ROLE_MASTER_PERMISSIONS,
    ROLE_MASTER_LOV_PERMISSIONS,
    ROLE_MASTER_COLUMN_PERMISSION,
    ALL_MASTER_COLUMNS_LIST
} = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const projectManagementDashboardMasterId = "800bec61-51bf-44ac-aee0-0d0bcab1fc05";

        queryInterface.sequelize.query(
            [
                { table: ALL_MASTER_COLUMNS_LIST, column: "master_id" },
                { table: ROLE_MASTER_COLUMN_PERMISSION, column: "master_id" },
                { table: ROLE_MASTER_LOV_PERMISSIONS, column: "master_id" },
                { table: ROLE_MASTER_PERMISSIONS, column: "master_id" },
                { table: USER_MASTER_COLUMN_PERMISSION, column: "master_id" },
                { table: USER_MASTER_LOV_PERMISSION, column: "master_id" },
                { table: USER_MASTER_PERMISSIONS, column: "grand_parent_id" },
                { table: USER_MASTER_PERMISSIONS, column: "master_id" },
                { table: USER_MASTER_PERMISSIONS, column: "parent_id" },
                { table: ALL_MASTERS_LIST, column: "id" }
            ].map(({ table, column }) => `DELETE FROM ${table} WHERE ${column} = '${projectManagementDashboardMasterId}';`).join("\n")
        );
    },

    async down(queryInterface, Sequelize) {
        //   
    }
};

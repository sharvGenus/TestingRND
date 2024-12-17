"use strict";

const config = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`ALTER TABLE ${config.GAA_LEVEL_ENTRIES_HISTORY} DROP COLUMN IF EXISTS approval_status;`);
        await queryInterface.addColumn(
            config.GAA_LEVEL_ENTRIES_HISTORY, // Table name
            "approval_status", // Column name
            {
                type: "enum_gaa_level_entries_approval_status", // ENUM type with values
                allowNull: true, // Allow NULL values
                defaultValue: "Unapproved" // Set default value
            }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn(
            config.GAA_LEVEL_ENTRIES_HISTORY, // Table name
            "approval_status" // Column name
        );
    }
};

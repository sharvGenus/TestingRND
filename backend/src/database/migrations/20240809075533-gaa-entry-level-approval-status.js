"use strict";

const config = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`ALTER TABLE ${config.GAA_LEVEL_ENTRIES} DROP COLUMN IF EXISTS approval_status;`);
        await queryInterface.addColumn(
            config.GAA_LEVEL_ENTRIES, // Table name
            "approval_status", // Column name
            {
                type: Sequelize.ENUM("Approved", "Unapproved"), // ENUM type with values
                allowNull: true, // Allow NULL values
                defaultValue: "Unapproved" // Set default value
            }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn(
            config.GAA_LEVEL_ENTRIES, // Table name
            "approval_status" // Column name
        );
    }
};

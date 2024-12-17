"use strict";
const config = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addColumn(
                config.ROLES, // Table name
                "is_import", // Column name
                {
                    type: Sequelize.BOOLEAN, // ENUM type with values
                    allowNull: false, // Allow NULL values
                    defaultValue: false // Set default value
                }
            ),
            queryInterface.addColumn(
                config.ROLES, // Table name
                "is_export", // Column name
                {
                    type: Sequelize.BOOLEAN, // ENUM type with values
                    allowNull: false, // Allow NULL values
                    defaultValue: true // Set default value
                }
            ),
            queryInterface.addColumn(
                config.ROLES, // Table name
                "is_update", // Column name
                {
                    type: Sequelize.BOOLEAN, // ENUM type with values
                    allowNull: false, // Allow NULL values
                    defaultValue: false // Set default value
                }
            ),
            queryInterface.addColumn(
                config.ROLES_HISTORY, // Table name
                "is_import", // Column name
                {
                    type: Sequelize.BOOLEAN, // ENUM type with values
                    allowNull: false, // Allow NULL values
                    defaultValue: false // Set default value
                }
            ),
            queryInterface.addColumn(
                config.ROLES_HISTORY, // Table name
                "is_export", // Column name
                {
                    type: Sequelize.BOOLEAN, // ENUM type with values
                    allowNull: false, // Allow NULL values
                    defaultValue: true // Set default value
                }
            ),
            queryInterface.addColumn(
                config.ROLES_HISTORY, // Table name
                "is_update", // Column name
                {
                    type: Sequelize.BOOLEAN, // ENUM type with values
                    allowNull: false, // Allow NULL values
                    defaultValue: false // Set default value
                }
            ),
        ])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn(
            config.ROLES, // Table name
            "is_import" // Column name
        );

        await queryInterface.removeColumn(
            config.ROLES, // Table name
            "is_export" // Column name
        );

        await queryInterface.removeColumn(
            config.ROLES, // Table name
            "is_update" // Column name
        );

        await queryInterface.removeColumn(
            config.ROLES_HISTORY, // Table name
            "is_import" // Column name
        );

        await queryInterface.removeColumn(
            config.ROLES_HISTORY, // Table name
            "is_export" // Column name
        );

        await queryInterface.removeColumn(
            config.ROLES_HISTORY, // Table name
            "is_update" // Column name
        );
    }
};

"use strict";

const config = require("../../config/database-schema");

module.exports = {
    async up(queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.removeColumn(config.ATTRIBUTE_INTEGRATION_PAYLOAD, "is_boolean"),
            queryInterface.removeColumn(config.ATTRIBUTE_INTEGRATION_PAYLOAD, "is_mandatory"),
            queryInterface.removeColumn(config.ATTRIBUTE_INTEGRATION_PAYLOAD, "sub_type"),
            queryInterface.removeColumn(config.ATTRIBUTE_INTEGRATION_PAYLOAD, "fixed_value"),
            queryInterface.addColumn(config.ATTRIBUTE_INTEGRATION_PAYLOAD, "properties", {
                type: Sequelize.JSON,
                allowNull: true
            })
        ]);
    },

    async down(queryInterface, Sequelize) {
    // This is a migration rollback, so you should add the columns back here
        await Promise.all([
            queryInterface.addColumn(
                config.ATTRIBUTE_INTEGRATION_PAYLOAD,
                "sub_type",
                {
                    type: Sequelize.TEXT,
                    field: "sub_type"
                }
            ),
            queryInterface.addColumn(
                config.ATTRIBUTE_INTEGRATION_PAYLOAD,
                "fixed_value",
                {
                    type: Sequelize.TEXT,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                config.ATTRIBUTE_INTEGRATION_PAYLOAD,
                "is_boolean",
                {
                    type: Sequelize.BOOLEAN,
                    field: "is_boolean"
                }
            ),
            queryInterface.addColumn(
                config.ATTRIBUTE_INTEGRATION_PAYLOAD,
                "is_mandatory",
                {
                    type: Sequelize.BOOLEAN,
                    field: "is_mandatory"
                }
            ),
            queryInterface.removeColumn(config.ATTRIBUTE_INTEGRATION_PAYLOAD, "properties")
        ]);
    }
};
"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addColumn(
                config.ATTRIBUTE_INTEGRATION_BLOCKS,
                "auth",
                {
                    type: Sequelize.TEXT,
                    field: "auth"
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
            queryInterface.addColumn(
                config.ATTRIBUTE_INTEGRATION_PAYLOAD,
                "sub_type",
                {
                    type: Sequelize.TEXT,
                    field: "sub_type"
                }
            )
        ]);
    },
    down: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.removeColumn(config.ATTRIBUTE_INTEGRATION_BLOCKS, "auth"),
            queryInterface.removeColumn(config.ATTRIBUTE_INTEGRATION_PAYLOAD, "is_boolean"),
            queryInterface.removeColumn(config.ATTRIBUTE_INTEGRATION_PAYLOAD, "is_mandatory"),
            queryInterface.removeColumn(config.ATTRIBUTE_INTEGRATION_PAYLOAD, "sub_type")
        ]);
    }
};

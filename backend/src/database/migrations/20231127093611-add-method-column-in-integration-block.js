"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
            config.ATTRIBUTE_INTEGRATION_BLOCKS,
            "method",
            {
                type: Sequelize.TEXT,
                field: "method"
            }
        );
    },
    down: async function (queryInterface, Sequelize) {
        return queryInterface.removeColumn(config.ATTRIBUTE_INTEGRATION_BLOCKS, "method");
    }
};

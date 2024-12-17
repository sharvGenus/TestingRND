"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
            config.ATTRIBUTE_INTEGRATION_PAYLOAD,
            "fixed_value",
            {
                type: Sequelize.TEXT,
                allowNull: true
            }
        );
    },
 
    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn(config.STOCK_LEDGER_DETAILS, "fixed_value");
    }
};
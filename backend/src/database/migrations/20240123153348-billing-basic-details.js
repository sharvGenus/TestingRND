"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.BILLING_BASIC_DETAILS,
                "bank_name",
                {
                    type: Sequelize.STRING,
                    field: "bank_name",
                    allowNull: false,
                    defaultValue: "-"
                }
            ),
            queryInterface.addColumn(
                config.BILLING_BASIC_DETAILS,
                "ifsc_code",
                {
                    type: Sequelize.STRING,
                    field: "ifsc_code",
                    allowNull: false,
                    defaultValue: "-"
                }
            ),
            queryInterface.addColumn(
                config.BILLING_BASIC_DETAILS,
                "account_number",
                {
                    type: Sequelize.BIGINT,
                    field: "account_number",
                    defaultValue: null
                }
            )
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn(config.BILLING_BASIC_DETAILS, "bank_name", "ifsc_code", "account_number");
    }
};

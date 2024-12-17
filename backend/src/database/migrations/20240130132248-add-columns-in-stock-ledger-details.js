"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.STOCK_LEDGER_DETAILS,
                "supplier_id",
                {
                    type: Sequelize.UUID,
                    field: "supplier_id",
                    references: {
                        model: config.ORGANIZATIONS,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "supplier_id",
                {
                    type: Sequelize.UUID,
                    field: "supplier_id",
                    references: {
                        model: config.ORGANIZATIONS,
                        key: "id"
                    }
                }
            )
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.STOCK_LEDGER_DETAILS, "supplier_id"),
            queryInterface.removeColumn(config.STOCK_LEDGER_DETAILS_HISTORY, "supplier_id")
        ]);
    }
};

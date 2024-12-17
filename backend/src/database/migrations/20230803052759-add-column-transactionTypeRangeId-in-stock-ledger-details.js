"use strict";

const config = require("../../config/database-schema");

async function addColumnIfNotExists(queryInterface, tableDescription, tableName, columnName, columnDefinition) {
    if (tableDescription[columnName]) {
        return Promise.resolve();
    } else {
        return queryInterface.addColumn(tableName, columnName, columnDefinition);
    }
}

module.exports = {
    up: async function (queryInterface, Sequelize) {
        const stockLedgerDetails = await queryInterface.describeTable(config.STOCK_LEDGER_DETAILS);
        await Promise.all([
            addColumnIfNotExists(queryInterface, stockLedgerDetails, config.STOCK_LEDGER_DETAILS, "transaction_type_range_id", {
                type: Sequelize.UUID,
                references: {
                    model: config.TRANSACTION_TYPE_RANGES,
                    key: "id"
                }
            }),
            addColumnIfNotExists(queryInterface, stockLedgerDetails, config.STOCK_LEDGER_DETAILS_HISTORY, "transaction_type_range_id", {
                type: Sequelize.UUID
            })
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "transaction_type_range_id"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "transaction_type_range_id"
            )
        ]);
    }
};
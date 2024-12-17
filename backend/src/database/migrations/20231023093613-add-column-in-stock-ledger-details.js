"use strict";

const config = require("../../config/database-schema");

async function addColumnIfNotExists(
    queryInterface,
    tableDescription,
    tableName,
    columnName,
    columnDefinition
) {
    if (tableDescription[columnName]) {
        return Promise.resolve();
    } else {
        return queryInterface.addColumn(
            tableName,
            columnName,
            columnDefinition
        );
    }
}

module.exports = {
    up: async function (queryInterface, Sequelize) {
        const [stockLedgerDetails, stockLedgerDetailsHistory] = await Promise.all([
            queryInterface.describeTable(config.STOCK_LEDGER_DETAILS),
            queryInterface.describeTable(config.STOCK_LEDGER_DETAILS_HISTORY)
        ]);

        return Promise.all([
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetails,
                config.STOCK_LEDGER_DETAILS,
                "serial_number",
                {
                    type: Sequelize.STRING,
                    field: "serial_number"
                }
            ),

            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetailsHistory,
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "serial_number",
                {
                    type: Sequelize.STRING,
                    field: "serial_number"
                }
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "serial_number"
            ),

            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "serial_number"
            )
        ]);
    }
};

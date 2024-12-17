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
            queryInterface.describeTable(
                config.STOCK_LEDGER_DETAILS_HISTORY
            )
        ]);

        return Promise.all([
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetails,
                config.STOCK_LEDGER_DETAILS,
                "consumer_name",
                {
                    type: Sequelize.STRING,
                    field: "consumer_name"
                }
            ),

            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetails,
                config.STOCK_LEDGER_DETAILS,
                "k_number",
                {
                    type: Sequelize.STRING,
                    field: "k_number"
                }
            ),

            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetails,
                config.STOCK_LEDGER_DETAILS,
                "response_id",
                {
                    type: Sequelize.UUID,
                    field: "response_id"
                }
            ),

            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetailsHistory,
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "consumer_name",
                {
                    type: Sequelize.STRING,
                    field: "consumer_name"
                }
            ),

            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetailsHistory,
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "k_number",
                {
                    type: Sequelize.STRING,
                    field: "k_number"
                }
            ),

            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetailsHistory,
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "response_id",
                {
                    type: Sequelize.UUID,
                    field: "response_id"
                }
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "consumer_name"
            ),

            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "k_number"
            ),

            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "response_id"
            ),

            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "consumer_name"
            ),

            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "k_number"
            ),

            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "response_id"
            )
        ]);
    }
};

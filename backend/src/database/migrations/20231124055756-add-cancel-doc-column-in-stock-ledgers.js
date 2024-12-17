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
        const [stockLedgers, stockLedgersHistory] = await Promise.all([
            queryInterface.describeTable(config.STOCK_LEDGERS),
            queryInterface.describeTable(
                config.STOCK_LEDGERS_HISTORY
            )
        ]);
 
        return Promise.all([
            addColumnIfNotExists(
                queryInterface,
                stockLedgers,
                config.STOCK_LEDGERS,
                "cancel_ref_doc_no",
                {
                    type: Sequelize.STRING,
                    field: "cancel_ref_doc_no"
                }
            ),
 
            addColumnIfNotExists(
                queryInterface,
                stockLedgersHistory,
                config.STOCK_LEDGERS_HISTORY,
                "cancel_ref_doc_no",
                {
                    type: Sequelize.STRING,
                    field: "cancel_ref_doc_no"
                }
            )
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                config.STOCK_LEDGERS,
                "cancel_ref_doc_no"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGERS_HISTORY,
                "cancel_ref_doc_no"
            )
        ]);
    }
};
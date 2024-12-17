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
            queryInterface.describeTable(config.REQUEST_APPROVALS),
            queryInterface.describeTable(
                config.REQUEST_APPROVALS_HISTORY
            )
        ]);
 
        return Promise.all([
            addColumnIfNotExists(
                queryInterface,
                stockLedgers,
                config.REQUEST_APPROVALS,
                "cancel_request_doc_no",
                {
                    type: Sequelize.STRING,
                    field: "cancel_request_doc_no"
                }
            ),
 
            addColumnIfNotExists(
                queryInterface,
                stockLedgersHistory,
                config.REQUEST_APPROVALS_HISTORY,
                "cancel_request_doc_no",
                {
                    type: Sequelize.STRING,
                    field: "cancel_request_doc_no"
                }
            )
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                config.REQUEST_APPROVALS,
                "cancel_request_doc_no"
            ),
            queryInterface.removeColumn(
                config.REQUEST_APPROVALS_HISTORY,
                "cancel_request_doc_no"
            )
        ]);
    }
};
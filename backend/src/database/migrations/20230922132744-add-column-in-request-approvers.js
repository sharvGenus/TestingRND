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
        const [requestApprovers, requestApproversHistory] = await Promise.all([
            queryInterface.describeTable(config.REQUEST_APPROVERS),
            queryInterface.describeTable(config.REQUEST_APPROVERS_HISTORY)
        ]);
        return Promise.all([
            addColumnIfNotExists(queryInterface, requestApprovers, config.REQUEST_APPROVERS, "transaction_type_id", {
                type: Sequelize.UUID,
                field: "transaction_type_id",
                references: {
                    model: config.MASTER_MAKER_LOVS,
                    key: "id"
                }
            }),
            addColumnIfNotExists(queryInterface, requestApproversHistory, config.REQUEST_APPROVERS_HISTORY, "transaction_type_id", {
                type: Sequelize.UUID,
                field: "transaction_type_id"
            })
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.REQUEST_APPROVERS, "transaction_type_id"),
            queryInterface.removeColumn(config.REQUEST_APPROVERS_HISTORY, "transaction_type_id")
        ]);
    }
};

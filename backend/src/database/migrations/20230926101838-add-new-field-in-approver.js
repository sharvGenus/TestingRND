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
        const [approver, approverHistory, requestApprovers, requestApproversHistory] = await Promise.all([
            queryInterface.describeTable(config.APPROVERS),
            queryInterface.describeTable(config.APPROVERS_HISTORY),
            queryInterface.describeTable(config.REQUEST_APPROVERS),
            queryInterface.describeTable(config.REQUEST_APPROVERS_HISTORY)
        ]);
        return Promise.all([
            addColumnIfNotExists(queryInterface, approver, config.APPROVERS, "store_id", {
                type: Sequelize.UUID,
                field: "store_id",
                references: {
                    model: config.ORGANIZATION_STORES,
                    key: "id"
                }
            }),
            addColumnIfNotExists(queryInterface, approverHistory, config.APPROVERS_HISTORY, "store_id", {
                type: Sequelize.UUID,
                field: "store_id"
            }),
            addColumnIfNotExists(queryInterface, requestApprovers, config.REQUEST_APPROVERS, "store_id", {
                type: Sequelize.UUID,
                field: "store_id",
                references: {
                    model: config.ORGANIZATION_STORES,
                    key: "id"
                }
            }),
            addColumnIfNotExists(queryInterface, requestApproversHistory, config.REQUEST_APPROVERS_HISTORY, "store_id", {
                type: Sequelize.UUID,
                field: "store_id"
            })
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.APPROVERS, "store_id"),
            queryInterface.removeColumn(config.APPROVERS_HISTORY, "store_id"),
            queryInterface.removeColumn(config.REQUEST_APPROVERS, "store_id"),
            queryInterface.removeColumn(config.REQUEST_APPROVERS_HISTORY, "store_id")
        ]);
    }
};
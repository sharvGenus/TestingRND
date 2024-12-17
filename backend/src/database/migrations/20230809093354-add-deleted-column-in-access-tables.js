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
        const [userMasterPermission, userLovPermission, userColumnPermission] = await Promise.all([
            queryInterface.describeTable(config.USER_MASTER_PERMISSIONS),
            queryInterface.describeTable(config.USER_MASTER_LOV_PERMISSION),
            queryInterface.describeTable(config.USER_MASTER_COLUMN_PERMISSION)
        ]);
        return Promise.all([
            addColumnIfNotExists(queryInterface, userMasterPermission, config.USER_MASTER_PERMISSIONS, "deleted_at", {
                type: Sequelize.DATE,
                field: "deleted_at"
            }),
            addColumnIfNotExists(queryInterface, userLovPermission, config.USER_MASTER_LOV_PERMISSION, "deleted_at", {
                type: Sequelize.DATE,
                field: "deleted_at"
            }),
            addColumnIfNotExists(queryInterface, userColumnPermission, config.USER_MASTER_COLUMN_PERMISSION, "deleted_at", {
                type: Sequelize.DATE,
                field: "deleted_at"
            })
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.USER_MASTER_PERMISSIONS, "deleted_at"),
            queryInterface.removeColumn(config.USER_MASTER_LOV_PERMISSION, "deleted_at"),
            queryInterface.removeColumn(config.USER_MASTER_COLUMN_PERMISSION, "deleted_at")
        ]);
    }
};

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
        const [roleMasterLovPermission] = await Promise.all([
            queryInterface.describeTable(config.ROLE_MASTER_LOV_PERMISSIONS)
        ]);
        return Promise.all([
            addColumnIfNotExists(queryInterface, roleMasterLovPermission, config.ROLE_MASTER_LOV_PERMISSIONS, "deleted_at", {
                type: Sequelize.DATE,
                field: "deleted_at"
            })
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.ROLE_MASTER_LOV_PERMISSIONS, "deleted_at")
        ]);
    }
};

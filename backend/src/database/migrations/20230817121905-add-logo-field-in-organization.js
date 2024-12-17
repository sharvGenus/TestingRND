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
        const [organization, organizationHistory] = await Promise.all([
            queryInterface.describeTable(config.ORGANIZATIONS),
            queryInterface.describeTable(config.ORGANIZATIONS_HISTORY)]);
        return Promise.all([
            addColumnIfNotExists(queryInterface, organization, config.ORGANIZATIONS, "logo", {
                type: Sequelize.TEXT,
                field: "logo"
            }),
            addColumnIfNotExists(queryInterface, organizationHistory, config.ORGANIZATIONS_HISTORY, "logo", {
                type: Sequelize.TEXT,
                field: "logo"
            }),
            queryInterface.changeColumn(config.ORGANIZATIONS, "attachments", {
                type: Sequelize.TEXT
            }),
            queryInterface.changeColumn(config.ORGANIZATIONS_HISTORY, "attachments", {
                type: Sequelize.TEXT
            })
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.ORGANIZATIONS, "logo"),
            queryInterface.removeColumn(config.ORGANIZATIONS_HISTORY, "logo"),
            queryInterface.changeColumn(config.ORGANIZATIONS, "attachments", {
                type: Sequelize.STRING
            }),
            queryInterface.changeColumn(config.ORGANIZATIONS_HISTORY, "attachments", {
                type: Sequelize.STRING
            })
        ]);
    }
};

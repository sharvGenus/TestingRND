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
        const [masterMakerLov, masterMakerLovHistory] = await Promise.all([
            queryInterface.describeTable(config.MASTER_MAKER_LOVS),
            queryInterface.describeTable(config.MASTER_MAKER_LOVS_HISTORY)]);
        return Promise.all([
            addColumnIfNotExists(queryInterface, masterMakerLov, config.MASTER_MAKER_LOVS, "code", {
                type: Sequelize.STRING,
                field: "code"
            }),
            addColumnIfNotExists(queryInterface, masterMakerLovHistory, config.MASTER_MAKER_LOVS_HISTORY, "code", {
                type: Sequelize.STRING,
                field: "code"
            })
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.MASTER_MAKER_LOVS, "code"),
            queryInterface.removeColumn(config.MASTER_MAKER_LOVS_HISTORY, "code")
        ]);
    }
};

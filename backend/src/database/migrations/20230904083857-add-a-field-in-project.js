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
        const [project, projectHistory] = await Promise.all([
            queryInterface.describeTable(config.PROJECTS),
            queryInterface.describeTable(config.PROJECTS_HISTORY)]);
        return Promise.all([
            addColumnIfNotExists(queryInterface, project, config.PROJECTS, "e_way_bill_limit", {
                type: Sequelize.FLOAT,
                field: "e_way_bill_limit"
            }),
            addColumnIfNotExists(queryInterface, projectHistory, config.PROJECTS_HISTORY, "e_way_bill_limit", {
                type: Sequelize.FLOAT,
                field: "e_way_bill_limit"
            })
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.PROJECTS, "e_way_bill_limit"),
            queryInterface.removeColumn(config.PROJECTS_HISTORY, "e_way_bill_limit")
        ]);
    }
};

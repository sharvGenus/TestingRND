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
        const [projectHistory, materialHistory] = await Promise.all([
            queryInterface.describeTable(config.PROJECTS_HISTORY),
            queryInterface.describeTable(config.MATERIALS_HISTORY)
        ]);
        return Promise.all([
            addColumnIfNotExists(queryInterface, projectHistory, config.PROJECTS_HISTORY, "scheme_name", {
                type: Sequelize.STRING,
                field: "scheme_name"
            }),
            queryInterface.changeColumn(config.PROJECTS_HISTORY, "po_extension_date", {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.changeColumn(config.PROJECTS_HISTORY, "closure_date", {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.changeColumn(config.PROJECTS_HISTORY, "fms_start_date", {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.changeColumn(config.PROJECTS_HISTORY, "fms_end_date", {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null
            }),
            addColumnIfNotExists(queryInterface, materialHistory, config.MATERIALS_HISTORY, "sap_description", {
                type: Sequelize.STRING,
                field: "sap_description"
            })
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.PROJECTS_HISTORY, "scheme_name"),
            queryInterface.removeColumn(config.MATERIALS_HISTORY, "sap_description"),
            queryInterface.changeColumn(config.PROJECTS_HISTORY, "po_extension_date", {
                type: Sequelize.DATE,
                allowNull: false
            }),
            queryInterface.changeColumn(config.PROJECTS_HISTORY, "closure_date", {
                type: Sequelize.DATE,
                allowNull: false
            }),
            queryInterface.changeColumn(config.PROJECTS_HISTORY, "fms_start_date", {
                type: Sequelize.DATE,
                allowNull: false
            }),
            queryInterface.changeColumn(config.PROJECTS_HISTORY, "fms_end_date", {
                type: Sequelize.DATE,
                allowNull: false
            })
        ]);
    }
};

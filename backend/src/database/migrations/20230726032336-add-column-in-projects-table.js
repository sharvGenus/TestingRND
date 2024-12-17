"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(config.PROJECTS, "scheme_name", {
                type: Sequelize.STRING,
                field: "scheme_name"
            }),
            
            queryInterface.changeColumn(config.ORGANIZATION_STORES, "code", {
                type: Sequelize.STRING
            }),
            queryInterface.changeColumn(config.ORGANIZATION_STORE_LOCATIONS, "code", {
                type: Sequelize.STRING
            }),
            queryInterface.changeColumn(config.PROJECTS, "po_extension_date", {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.changeColumn(config.PROJECTS, "closure_date", {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.changeColumn(config.PROJECTS, "fms_start_date", {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.changeColumn(config.PROJECTS, "fms_end_date", {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.addColumn(
                config.MATERIALS,
                "sap_description",
                {
                    type: Sequelize.STRING,
                    field: "sap_description"
                }
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.PROJECTS, "scheme_name"),
            queryInterface.removeColumn(config.MATERIALS, "sap_description"),
            queryInterface.changeColumn(config.ORGANIZATION_STORES, "code", {
                type: Sequelize.INTEGER
            }),
            queryInterface.changeColumn(config.ORGANIZATION_STORE_LOCATIONS, "code", {
                type: Sequelize.INTEGER
            }),
            queryInterface.changeColumn(config.PROJECTS, "po_extension_date", {
                type: Sequelize.DATE,
                allowNull: false
            }),
            queryInterface.changeColumn(config.PROJECTS, "closure_date", {
                type: Sequelize.DATE,
                allowNull: false
            }),
            queryInterface.changeColumn(config.PROJECTS, "fms_start_date", {
                type: Sequelize.DATE,
                allowNull: false
            }),
            queryInterface.changeColumn(config.PROJECTS, "fms_end_date", {
                type: Sequelize.DATE,
                allowNull: false
            })
        ]);
    }
};

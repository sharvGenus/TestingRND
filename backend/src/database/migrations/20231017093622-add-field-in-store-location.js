"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addColumn(
                config.ORGANIZATION_STORE_LOCATIONS,
                "is_faulty",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    allowNull: false
                }
            ),
            queryInterface.addColumn(
                config.ORGANIZATION_STORE_LOCATIONS_HISTORY,
                "is_faulty",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    allowNull: false
                }
            ),
            queryInterface.addColumn(
                config.ORGANIZATION_STORE_LOCATIONS,
                "is_scrap",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    allowNull: false
                }
            ),
            queryInterface.addColumn(
                config.ORGANIZATION_STORE_LOCATIONS_HISTORY,
                "is_scrap",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    allowNull: false
                }
            ),
            queryInterface.addColumn(
                config.ORGANIZATION_STORE_LOCATIONS,
                "is_installed",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    allowNull: false
                }
            ),
            queryInterface.addColumn(
                config.ORGANIZATION_STORE_LOCATIONS_HISTORY,
                "is_installed",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    allowNull: false
                }
            ),
            queryInterface.addColumn(
                config.ORGANIZATION_STORE_LOCATIONS,
                "for_installer",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    allowNull: false
                }
            ),
            queryInterface.addColumn(
                config.ORGANIZATION_STORE_LOCATIONS_HISTORY,
                "for_installer",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    allowNull: false
                }
            ),
            queryInterface.addColumn(
                config.ORGANIZATION_STORE_LOCATIONS,
                "is_old",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    allowNull: false
                }
            ),
            queryInterface.addColumn(
                config.ORGANIZATION_STORE_LOCATIONS_HISTORY,
                "is_old",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    allowNull: false
                }
            )
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.ORGANIZATION_STORE_LOCATIONS, "is_faulty"),
            queryInterface.removeColumn(config.ORGANIZATION_STORE_LOCATIONS_HISTORY, "is_faulty"),
            queryInterface.removeColumn(config.ORGANIZATION_STORE_LOCATIONS, "is_scrap"),
            queryInterface.removeColumn(config.ORGANIZATION_STORE_LOCATIONS_HISTORY, "is_scrap"),
            queryInterface.removeColumn(config.ORGANIZATION_STORE_LOCATIONS, "is_installed"),
            queryInterface.removeColumn(config.ORGANIZATION_STORE_LOCATIONS_HISTORY, "is_installed"),
            queryInterface.removeColumn(config.ORGANIZATION_STORE_LOCATIONS, "for_installer"),
            queryInterface.removeColumn(config.ORGANIZATION_STORE_LOCATIONS_HISTORY, "for_installer"),
            queryInterface.removeColumn(config.ORGANIZATION_STORE_LOCATIONS, "is_old"),
            queryInterface.removeColumn(config.ORGANIZATION_STORE_LOCATIONS_HISTORY, "is_old")
        ]);
    }
};
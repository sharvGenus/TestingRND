"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addColumn(
                config.ORGANIZATION_STORE_LOCATIONS,
                "is_restricted",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                    allowNull: false
                }
            ),
            queryInterface.addColumn(
                config.ORGANIZATION_STORE_LOCATIONS_HISTORY,
                "is_restricted",
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
            queryInterface.removeColumn(config.ORGANIZATION_STORE_LOCATIONS, "is_restricted"),
            queryInterface.removeColumn(config.ORGANIZATION_STORE_LOCATIONS_HISTORY, "is_restricted")
        ]);
    }
};
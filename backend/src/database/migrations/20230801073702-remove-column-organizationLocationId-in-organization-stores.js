"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.removeColumn(
                config.ORGANIZATION_STORES,
                "organization_location_id"
            ),
            queryInterface.removeColumn(
                config.ORGANIZATION_STORES_HISTORY,
                "organization_location_id"
            )
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.ORGANIZATION_STORES,
                "organization_location_id",
                {
                    type: Sequelize.UUID
                }
            ),
            queryInterface.addColumn(
                config.ORGANIZATION_STORES_HISTORY,
                "organization_location_id",
                {
                    type: Sequelize.UUID
                }
            )
        ]);
    }
};
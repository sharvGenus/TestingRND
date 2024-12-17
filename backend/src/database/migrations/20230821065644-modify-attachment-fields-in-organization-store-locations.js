"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn(
                config.ORGANIZATION_STORE_LOCATIONS,
                "store_photo",
                {
                    type: Sequelize.TEXT
                }
            ),
            queryInterface.changeColumn(
                config.ORGANIZATION_STORE_LOCATIONS_HISTORY,
                "store_photo",
                {
                    type: Sequelize.TEXT
                }
            ),
            queryInterface.changeColumn(
                config.ORGANIZATION_STORE_LOCATIONS,
                "attachments",
                {
                    type: Sequelize.TEXT
                }
            ),
            queryInterface.changeColumn(
                config.ORGANIZATION_STORE_LOCATIONS_HISTORY,
                "attachments",
                {
                    type: Sequelize.TEXT
                }
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn(
                config.ORGANIZATION_STORE_LOCATIONS,
                "store_photo",
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.changeColumn(
                config.ORGANIZATION_STORE_LOCATIONS_HISTORY,
                "store_photo",
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.changeColumn(
                config.ORGANIZATION_STORE_LOCATIONS,
                "attachments",
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.changeColumn(
                config.ORGANIZATION_STORE_LOCATIONS_HISTORY,
                "attachments",
                {
                    type: Sequelize.STRING
                }
            )
        ]);
    }
};

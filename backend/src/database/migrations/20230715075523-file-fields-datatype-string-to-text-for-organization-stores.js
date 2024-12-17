"use strict";

const config = require("../../config/database-schema");

module.exports = {
    async up(queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.changeColumn(
                config.ORGANIZATION_STORES,
                "attachments",
                {
                    type: Sequelize.TEXT
                }
            ),
            queryInterface.changeColumn(
                config.ORGANIZATION_STORES,
                "store_photo",
                {
                    type: Sequelize.TEXT
                }
            )
        ]);
    },

    async down(queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.changeColumn(
                config.ORGANIZATION_STORES,
                "attachments",
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.changeColumn(
                config.ORGANIZATION_STORES,
                "store_photo",
                {
                    type: Sequelize.STRING
                }
            )
        ]);
    }
};

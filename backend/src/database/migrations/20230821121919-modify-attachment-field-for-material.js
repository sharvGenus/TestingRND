"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn(
                config.MATERIALS,
                "attachments",
                {
                    type: Sequelize.TEXT
                }
            ),
            queryInterface.changeColumn(
                config.MATERIALS_HISTORY,
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
                config.MATERIALS,
                "attachments",
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.changeColumn(
                config.MATERIALS_HISTORY,
                "attachments",
                {
                    type: Sequelize.STRING
                }
            )
        ]);
    }
};

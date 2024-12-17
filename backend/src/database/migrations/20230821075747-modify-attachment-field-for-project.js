"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn(
                config.PROJECTS,
                "attachments",
                {
                    type: Sequelize.TEXT
                }
            ),
            queryInterface.changeColumn(
                config.PROJECTS_HISTORY,
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
                config.PROJECTS,
                "attachments",
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.changeColumn(
                config.PROJECTS_HISTORY,
                "attachments",
                {
                    type: Sequelize.STRING
                }
            )
        ]);
    }
};

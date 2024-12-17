"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.USERS,
                "app_version",
                {
                    type: Sequelize.STRING,
                    field: "app_version"
                }
            ),
      
            queryInterface.addColumn(
                config.USERS_HISTORY,
                "app_version",
                {
                    type: Sequelize.STRING,
                    field: "app_version"
                }
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.USERS, "app_version"),
            queryInterface.removeColumn(config.USERS_HISTORY, "app_version")
        ]);
    }
};
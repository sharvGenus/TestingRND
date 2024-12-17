"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.USERS,
                "authorized_user",
                {
                    type: Sequelize.BOOLEAN,
                    field: "authorized_user",
                    defaultValue: false
                }
            ),
            queryInterface.addColumn(
                config.USERS_HISTORY,
                "authorized_user",
                {
                    type: Sequelize.BOOLEAN,
                    field: "authorized_user",
                    defaultValue: false
                }
            ),
            queryInterface.changeColumn(
                config.USERS,
                "attachments",
                {
                    type: Sequelize.TEXT
                }
            ),
            queryInterface.changeColumn(
                config.USERS_HISTORY,
                "attachments",
                {
                    type: Sequelize.TEXT
                }
            )
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.USERS, "authorized_user"),
            queryInterface.removeColumn(config.USERS_HISTORY, "authorized_user"),
            queryInterface.changeColumn(
                config.USERS,
                "attachments",
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.changeColumn(
                config.USERS_HISTORY,
                "attachments",
                {
                    type: Sequelize.STRING
                }
            )
        ]);
    }
};
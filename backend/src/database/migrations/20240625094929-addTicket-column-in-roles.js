"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.ROLES,
                "add_ticket",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                }
            ),
            queryInterface.addColumn(
                config.ROLES_HISTORY,
                "add_ticket",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                }
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.ROLES, "add_ticket"),
            queryInterface.removeColumn(config.ROLES_HISTORY, "add_ticket")
        ]);
    }
};
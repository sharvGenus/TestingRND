"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.ROLES,
                "for_ticket",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                }
            ),
            queryInterface.addColumn(
                config.ROLES_HISTORY,
                "for_ticket",
                {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                }
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.ROLES, "for_ticket"),
            queryInterface.removeColumn(config.ROLES_HISTORY, "for_ticket")
        ]);
    }
};
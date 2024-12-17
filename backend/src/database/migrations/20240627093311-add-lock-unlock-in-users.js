"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(config.USERS, "is_locked", {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                field: "is_locked"
            }),
            queryInterface.addColumn(config.USERS_HISTORY, "is_locked", {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                field: "is_locked"
            })
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.USERS, "is_locked"),
            queryInterface.removeColumn(config.USERS_HISTORY, "is_locked"),
        ]);
    }
};

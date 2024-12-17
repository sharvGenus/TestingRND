"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.USERS,
                "verify_otp",
                {
                    type: Sequelize.STRING,
                    field: "verify_otp"
                }
            ),
            queryInterface.addColumn(
                config.USERS_HISTORY,
                "verify_otp",
                {
                    type: Sequelize.STRING,
                    field: "verify_otp"
                }
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.USERS, "verify_otp"),
            queryInterface.removeColumn(config.USERS_HISTORY, "verify_otp")]);
    }
};
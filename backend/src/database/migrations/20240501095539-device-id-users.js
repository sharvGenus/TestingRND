"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.USERS,
                "device_id",
                {
                    type: Sequelize.STRING,
                    field: "device_id"
                }
            ),
            queryInterface.addColumn(
                config.USERS,
                "aadhar_no",
                {
                    type: Sequelize.STRING,
                    field: "aadhar_no"
                }
            ),
            queryInterface.addColumn(
                config.USERS_HISTORY,
                "device_id",
                {
                    type: Sequelize.STRING,
                    field: "device_id"
                }
            ),
            queryInterface.addColumn(
                config.USERS_HISTORY,
                "aadhar_no",
                {
                    type: Sequelize.STRING,
                    field: "aadhar_no"
                }
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.USERS, "device_id"),
            queryInterface.removeColumn(config.USERS_HISTORY, "device_id"),
            queryInterface.removeColumn(config.USERS, "aadhar_no"),
            queryInterface.removeColumn(config.USERS_HISTORY, "aadhar_no")
        ]);
    }
};
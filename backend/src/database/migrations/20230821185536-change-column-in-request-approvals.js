"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.changeColumn(
                config.REQUEST_APPROVALS,
                "serial_numbers",
                {
                    type: Sequelize.TEXT
                }
            ),
            queryInterface.changeColumn(
                config.REQUEST_APPROVALS_HISTORY,
                "serial_numbers",
                {
                    type: Sequelize.TEXT
                }
            )
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn(
                config.REQUEST_APPROVALS,
                "serial_numbers",
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.changeColumn(
                config.REQUEST_APPROVALS_HISTORY,
                "serial_numbers",
                {
                    type: Sequelize.STRING
                }
            )
        ]);
    }
};
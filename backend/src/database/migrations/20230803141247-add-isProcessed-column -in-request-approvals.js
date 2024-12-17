"use strict";
 
const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.REQUEST_APPROVALS,
                "is_processed",
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                }
            ),
            queryInterface.addColumn(
                config.REQUEST_APPROVALS_HISTORY,
                "is_processed",
                {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                }
            )
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.REQUEST_APPROVALS, "is_processed"),
            queryInterface.removeColumn(config.REQUEST_APPROVALS_HISTORY, "is_processed")
        ]);
    }
};
"use strict";
 
const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn(
                config.STOCK_LEDGERS,
                "quantity",
                {
                    type: Sequelize.FLOAT
                }
            ),
            queryInterface.changeColumn(
                config.STOCK_LEDGERS_HISTORY,
                "quantity",
                {
                    type: Sequelize.FLOAT
                }
            ),
            queryInterface.changeColumn(
                config.REQUEST_APPROVALS,
                "requested_quantity",
                {
                    type: Sequelize.FLOAT
                }
            ),
            queryInterface.changeColumn(
                config.REQUEST_APPROVALS_HISTORY,
                "requested_quantity",
                {
                    type: Sequelize.FLOAT
                }
            ),
            queryInterface.changeColumn(
                config.REQUEST_APPROVALS,
                "approved_quantity",
                {
                    type: Sequelize.FLOAT
                }
            ),
            queryInterface.changeColumn(
                config.REQUEST_APPROVALS_HISTORY,
                "approved_quantity",
                {
                    type: Sequelize.FLOAT
                }
            )
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn(
                config.STOCK_LEDGERS,
                "quantity",
                {
                    type: Sequelize.INTEGER
                }
            ),
            queryInterface.changeColumn(
                config.STOCK_LEDGERS_HISTORY,
                "quantity",
                {
                    type: Sequelize.INTEGER
                }
            ),
            queryInterface.changeColumn(
                config.REQUEST_APPROVALS,
                "requested_quantity",
                {
                    type: Sequelize.INTEGER
                }
            ),
            queryInterface.changeColumn(
                config.REQUEST_APPROVALS_HISTORY,
                "requested_quantity",
                {
                    type: Sequelize.INTEGER
                }
            ),
            queryInterface.changeColumn(
                config.REQUEST_APPROVALS,
                "approved_quantity",
                {
                    type: Sequelize.INTEGER
                }
            ),
            queryInterface.changeColumn(
                config.REQUEST_APPROVALS_HISTORY,
                "approved_quantity",
                {
                    type: Sequelize.INTEGER
                }
            )
        ]);
    }
};
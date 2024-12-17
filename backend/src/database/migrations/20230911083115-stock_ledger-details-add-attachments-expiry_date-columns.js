"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.STOCK_LEDGER_DETAILS,
                "attachments",
                {
                    type: Sequelize.ARRAY(Sequelize.STRING),
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "attachments",
                {
                    type: Sequelize.ARRAY(Sequelize.STRING),
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGER_DETAILS,
                "expiry_date",
                {
                    type: Sequelize.DATE,
                    allowNull: true
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "expiry_date",
                {
                    type: Sequelize.DATE,
                    allowNull: true
                }
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "attachments"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "attachments"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "expiry_date"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "expiry_date"
            )
        ]);
    }
};

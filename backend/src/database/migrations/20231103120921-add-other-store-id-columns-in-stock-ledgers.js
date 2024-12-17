"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addColumn(
                config.STOCK_LEDGERS,
                "other_store_id",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.ORGANIZATION_STORES,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGERS,
                "other_store_location_id",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.ORGANIZATION_STORE_LOCATIONS,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGERS_HISTORY,
                "other_store_id",
                {
                    type: Sequelize.UUID
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGERS_HISTORY,
                "other_store_location_id",
                {
                    type: Sequelize.UUID
                }
            )
        ]);
    },
    down: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.removeColumn(config.STOCK_LEDGERS, "other_store_id"),
            queryInterface.removeColumn(config.STOCK_LEDGERS_HISTORY, "other_store_id"),
            queryInterface.removeColumn(config.STOCK_LEDGERS, "other_store_location_id"),
            queryInterface.removeColumn(config.STOCK_LEDGERS_HISTORY, "other_store_location_id")
        ]);
    }
};

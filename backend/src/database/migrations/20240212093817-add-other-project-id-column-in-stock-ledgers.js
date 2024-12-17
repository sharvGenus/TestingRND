"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addColumn(
                config.STOCK_LEDGERS,
                "other_project_id",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.PROJECTS,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                config.STOCK_LEDGERS_HISTORY,
                "other_project_id",
                {
                    type: Sequelize.UUID
                }
            )
        ]);
    },
    down: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.removeColumn(config.STOCK_LEDGERS, "other_project_id"),
            queryInterface.removeColumn(config.STOCK_LEDGERS_HISTORY, "other_project_id")
        ]);
    }
};
"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.removeColumn(
                config.ORGANIZATIONS,
                "title"
            ),
            queryInterface.removeColumn(
                config.ORGANIZATIONS_HISTORY,
                "title"
            )
        ]);
        return Promise.all([
            queryInterface.addColumn(
                config.ORGANIZATIONS,
                "title",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                config.ORGANIZATIONS_HISTORY,
                "title",
                {
                    type: Sequelize.UUID
                }
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                config.ORGANIZATIONS,
                "title"
            ),
            queryInterface.addColumn(
                config.ORGANIZATIONS,
                "title",
                {
                    type: Sequelize.ENUM,
                    values: ["mr", "ms", "mrs"],
                    defaultValue: "mr"
                }
            ),
            queryInterface.removeColumn(
                config.ORGANIZATIONS_HISTORY,
                "title"
            ),
            queryInterface.addColumn(
                config.ORGANIZATIONS_HISTORY,
                "title",
                {
                    type: Sequelize.ENUM,
                    values: ["mr", "ms", "mrs"],
                    defaultValue: "mr"
                }
            )
        ]);
    }
};

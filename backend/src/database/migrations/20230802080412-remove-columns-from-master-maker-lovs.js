"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.removeColumn(
                config.MASTER_MAKER_LOVS,
                "code"
            ),
            queryInterface.removeColumn(
                config.MASTER_MAKER_LOVS,
                "financial_year"
            ),
            queryInterface.removeColumn(
                config.MASTER_MAKER_LOVS,
                "range_from"
            ),
            queryInterface.removeColumn(
                config.MASTER_MAKER_LOVS,
                "range_to"
            ),
            queryInterface.removeColumn(
                config.MASTER_MAKER_LOVS_HISTORY,
                "code"
            ),
            queryInterface.removeColumn(
                config.MASTER_MAKER_LOVS_HISTORY,
                "financial_year"
            ),
            queryInterface.removeColumn(
                config.MASTER_MAKER_LOVS_HISTORY,
                "range_from"
            ),
            queryInterface.removeColumn(
                config.MASTER_MAKER_LOVS_HISTORY,
                "range_to"
            )
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.MASTER_MAKER_LOVS,
                "code",
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: "NA"
                }
            ),
            queryInterface.addColumn(
                config.MASTER_MAKER_LOVS,
                "financial_year",
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.addColumn(
                config.MASTER_MAKER_LOVS,
                "range_from",
                {
                    type: Sequelize.INTEGER
                }
            ),
            queryInterface.addColumn(
                config.MASTER_MAKER_LOVS,
                "range_to",
                {
                    type: Sequelize.INTEGER
                }
            ),
            queryInterface.addColumn(
                config.MASTER_MAKER_LOVS_HISTORY,
                "code",
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: "NA"
                }
            ),
            queryInterface.addColumn(
                config.MASTER_MAKER_LOVS_HISTORY,
                "financial_year",
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.addColumn(
                config.MASTER_MAKER_LOVS_HISTORY,
                "range_from",
                {
                    type: Sequelize.INTEGER
                }
            ),
            queryInterface.addColumn(
                config.MASTER_MAKER_LOVS_HISTORY,
                "range_to",
                {
                    type: Sequelize.INTEGER
                }
            )
        ]);
    }
};

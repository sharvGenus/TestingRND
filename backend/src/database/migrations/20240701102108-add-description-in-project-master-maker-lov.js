"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.PROJECT_MASTER_MAKER_LOVS,
                "description",
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.addColumn(
                config.PROJECT_MASTER_MAKER_LOVS_HISTORY,
                "description",
                {
                    type: Sequelize.STRING
                }
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.PROJECT_MASTER_MAKER_LOVS, "description"),
            queryInterface.removeColumn(config.PROJECT_MASTER_MAKER_LOVS_HISTORY, "description")
        ]);
    }
};
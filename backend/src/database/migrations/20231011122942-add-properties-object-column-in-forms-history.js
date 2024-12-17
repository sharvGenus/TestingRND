"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
            config.FORMS_HISTORY,
            "properties",
            {
                type: Sequelize.JSON
            }
        );
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn(config.FORMS_HISTORY, "properties");
    }
};
"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(config.FORMS, "self_search_columns", {
                type: Sequelize.ARRAY(Sequelize.UUID),
                field: "self_search_columns",
            }),
            queryInterface.addColumn(
                config.FORMS_HISTORY,
                "self_search_columns",
                {
                    type: Sequelize.ARRAY(Sequelize.UUID),
                    field: "self_search_columns",
                }
            ),
        ]);
    },
    down: async function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.FORMS, "self_search_columns"),
            queryInterface.removeColumn(
                config.FORMS_HISTORY,
                "self_search_columns"
            ),
        ]);
    },
};

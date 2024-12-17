"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
            config.DEFAULT_ATTRIBUTES,
            "input_type",
            {
                type: Sequelize.STRING,
                field: "input_type"
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn(config.DEFAULT_ATTRIBUTES, "input_type");
    }
};

"use strict";

const { ATTRIBUTE_VALIDATION_BLOCKS, FORM_ATTRIBUTES } = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
            ATTRIBUTE_VALIDATION_BLOCKS,
            "primary_column",
            {
                type: Sequelize.UUID,
                field: "primary_column",
                references: {
                    model: FORM_ATTRIBUTES,
                    key: "id"
                }
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn(ATTRIBUTE_VALIDATION_BLOCKS, "primary_column");
    }
};
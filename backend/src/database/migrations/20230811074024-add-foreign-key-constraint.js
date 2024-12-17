"use strict";

const { ATTRIBUTE_VISIBILITY_CONDITIONS, FORM_ATTRIBUTES } = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn(
                ATTRIBUTE_VISIBILITY_CONDITIONS,
                "form_attribute_id",
                {
                    type: Sequelize.UUID,
                    field: "form_attribute_id",
                    references: {
                        model: FORM_ATTRIBUTES,
                        key: "id"
                    }
                }
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn(
                ATTRIBUTE_VISIBILITY_CONDITIONS,
                "form_attribute_id",
                {
                    type: Sequelize.UUID
                }
            )
        ]);
    }
};

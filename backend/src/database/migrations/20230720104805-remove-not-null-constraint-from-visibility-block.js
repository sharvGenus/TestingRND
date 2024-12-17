"use strict";

const { ATTRIBUTE_VISIBILITY_BLOCKS } = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.changeColumn(ATTRIBUTE_VISIBILITY_BLOCKS, "visible_columns", {
            type: Sequelize.ARRAY(Sequelize.STRING),
            field: "visible_columns",
            allowNull: true,
            defaultValue: null
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.changeColumn(ATTRIBUTE_VISIBILITY_BLOCKS, "visible_columns", {
            type: Sequelize.ARRAY(Sequelize.STRING),
            field: "visible_columns",
            allowNull: false,
            defaultValue: []
        });
    }
};

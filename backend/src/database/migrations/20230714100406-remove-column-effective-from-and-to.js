"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                config.APPROVERS,
                "effective_from",
                {
                    type: Sequelize.DATE,
                    field: "effective_from"
                }
            ),
            queryInterface.removeColumn(
                config.APPROVERS,
                "effective_to",
                {
                    type: Sequelize.DATE,
                    field: "effective_to"
                }
            )
        ]);
    }
};
"use strict";

const { USERS } = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
            USERS,
            "supervisor_id",
            {
                type: Sequelize.UUID,
                field: "supervisor_id",
                references: {
                    model: USERS,
                    key: "id"
                }
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn(USERS, "supervisor_id");
    }
};

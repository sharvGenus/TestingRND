"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.USERS,
                "status",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                config.USERS_HISTORY,
                "status",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                }
            )
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.USERS, "status"),
            queryInterface.removeColumn(config.USERS_HISTORY, "status")
        ]);
    }
};
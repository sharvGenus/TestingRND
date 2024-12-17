"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addColumn(
                config.USERS,
                "organisation_branch_id",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.ORGANIZATIONS,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                config.USERS_HISTORY,
                "organisation_branch_id",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.ORGANIZATIONS,
                        key: "id"
                    }
                }
            )
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.USERS, "organisation_branch_id"),
            queryInterface.removeColumn(config.USERS_HISTORY, "organisation_branch_id")
        ]);
    }
};
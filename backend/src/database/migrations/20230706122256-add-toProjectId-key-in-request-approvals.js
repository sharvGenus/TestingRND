"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
            config.REQUEST_APPROVALS,
            "to_project_id",
            {
                type: Sequelize.UUID,
                field: "to_project_id",
                references: {
                    model: config.PROJECTS,
                    key: "id"
                }
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn(config.REQUEST_APPROVALS, "to_project_id");
    }
};

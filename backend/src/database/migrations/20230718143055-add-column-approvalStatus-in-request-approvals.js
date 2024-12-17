"use strict";
 
const config = require("../../config/database-schema");
 
module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.REQUEST_APPROVALS,
                "approval_status",
                {
                    type: Sequelize.ENUM,
                    field: "approval_status",
                    values: ["0", "1", "2"],
                    allowNull: false,
                    defaultValue: "2"
                }
            )
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn(config.REQUEST_APPROVALS, "approval_status");
    }
};
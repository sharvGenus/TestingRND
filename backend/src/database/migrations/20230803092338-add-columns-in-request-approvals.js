"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addColumn(
                config.REQUEST_APPROVALS,
                "po_number",
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.addColumn(
                config.REQUEST_APPROVALS,
                "contractor_employee_id",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.USERS,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                config.REQUEST_APPROVALS_HISTORY,
                "po_number",
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.addColumn(
                config.REQUEST_APPROVALS_HISTORY,
                "contractor_employee_id",
                {
                    type: Sequelize.UUID
                }
            )
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                config.REQUEST_APPROVALS,
                "po_number"
            ),
            queryInterface.removeColumn(
                config.REQUEST_APPROVALS,
                "contractor_employee_id"
            ),
            queryInterface.removeColumn(
                config.REQUEST_APPROVALS_HISTORY,
                "po_number"
            ),
            queryInterface.removeColumn(
                config.REQUEST_APPROVALS_HISTORY,
                "contractor_employee_id"
            )
        ]);
    }
};
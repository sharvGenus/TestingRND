"use strict";

const { FORMS_NOTIFICATIONS, TICKETS } = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
            FORMS_NOTIFICATIONS,
            "ticket_id",
            {
                type: Sequelize.UUID,
                field: "ticket_id",
                references: {
                    model: TICKETS,
                    key: "id"
                }
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn(FORMS_NOTIFICATIONS, "primary_column");
    }
};

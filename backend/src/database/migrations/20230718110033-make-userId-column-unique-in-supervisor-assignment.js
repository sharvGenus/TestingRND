"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add a unique constraint on the userId column
        await queryInterface.addConstraint(config.SUPERVISOR_ASSIGNMENTS, {
            fields: ["user_id"],
            type: "unique",
            name: "unique_user_id_constraint"
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove the unique constraint on the userId column
        await queryInterface.removeConstraint(config.SUPERVISOR_ASSIGNMENTS, "unique_user_id_constraint");
    }
};

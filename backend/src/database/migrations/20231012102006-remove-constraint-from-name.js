"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Remove the unique constraint on the userId column
        await queryInterface.removeConstraint(config.PROJECT_MASTER_MAKERS, "project_master_makers_name_key");
    },

    down: async (queryInterface, Sequelize) => {
        // Add the unique constraint on the userId column
        await queryInterface.addConstraint(config.PROJECT_MASTER_MAKERS, {
            fields: ["name"],
            type: "unique",
            name: "project_master_makers_name_key"
        });
    }
};

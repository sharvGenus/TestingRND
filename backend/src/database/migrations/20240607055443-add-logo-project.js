"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(config.PROJECTS, "logo_one", {
                type: Sequelize.STRING,
                field: "logo_one"
            }),
            queryInterface.addColumn(config.PROJECTS, "logo_two", {
                type: Sequelize.STRING,
                field: "logo_two"
            }),
            queryInterface.addColumn(config.PROJECTS_HISTORY, "logo_one", {
                type: Sequelize.STRING,
                field: "logo_one"
            }),
            queryInterface.addColumn(config.PROJECTS_HISTORY, "logo_two", {
                type: Sequelize.STRING,
                field: "logo_two"
            })
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.PROJECTS, "logo_one"),
            queryInterface.removeColumn(config.PROJECTS, "logo_two"),
            queryInterface.removeColumn(config.PROJECTS_HISTORY, "logo_one"),
            queryInterface.removeColumn(config.PROJECTS_HISTORY, "logo_two")
        ]);
    }
};

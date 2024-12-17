"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn(config.ORGANIZATION_STORES_HISTORY, "code", {
                type: Sequelize.STRING
            }),
            queryInterface.changeColumn(config.ORGANIZATION_STORE_LOCATIONS_HISTORY, "code", {
                type: Sequelize.STRING
            })
        ]);
    },

    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn(config.ORGANIZATION_STORES_HISTORY, "code", {
                type: Sequelize.INTEGER
            }),
            queryInterface.changeColumn(config.ORGANIZATION_STORE_LOCATIONS_HISTORY, "code", {
                type: Sequelize.INTEGER
            })
        ]);
    }
};

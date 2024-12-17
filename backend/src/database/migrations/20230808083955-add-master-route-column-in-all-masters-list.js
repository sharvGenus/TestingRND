"use strict";

const { ALL_MASTERS_LIST, ALL_MASTERS_LIST_HISTORY, USER_MASTER_PERMISSIONS } = require("../../config/database-schema");
 
module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([

            // add column in the history table
            queryInterface.addColumn(
                ALL_MASTERS_LIST,
                "master_route",
                {
                    type: Sequelize.STRING,
                    field: "master_route"
    
                }
            ),
            queryInterface.addColumn(
                USER_MASTER_PERMISSIONS,
                "master_route",
                {
                    type: Sequelize.STRING,
                    field: "master_route"
                }
            ),

            // add column in the history table
            queryInterface.addColumn(
                ALL_MASTERS_LIST_HISTORY,
                "master_route",
                {
                    type: Sequelize.STRING,
                    field: "master_route"
                }
            )
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            // ROLLBACK OF MAIN TABLE
            queryInterface.removeColumn(ALL_MASTERS_LIST, "master_route"),
            queryInterface.removeColumn(USER_MASTER_PERMISSIONS, "master_route"),

            // ROLLBACK OF HISTORY TABLE,
            queryInterface.removeColumn(ALL_MASTERS_LIST_HISTORY, "master_route")
        ]);
    }
};
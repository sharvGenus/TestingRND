"use strict";

const { ALL_MASTERS_LIST, ALL_MASTERS_LIST_HISTORY } = require("../../config/database-schema");
 
module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([

            // add column in the history table
            queryInterface.addColumn(
                ALL_MASTERS_LIST,
                "is_master",
                {
                    type: Sequelize.BOOLEAN,
                    field: "is_master"
                }
            ),

            // add column in the history table
            queryInterface.addColumn(
                ALL_MASTERS_LIST_HISTORY,
                "is_master",
                {
                    type: Sequelize.BOOLEAN,
                    field: "is_master"
                }
            )
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            // ROLLBACK OF MAIN TABLE
            queryInterface.removeColumn(ALL_MASTERS_LIST, "is_master"),
            // ROLLBACK OF HISTORY TABLE
            queryInterface.removeColumn(ALL_MASTERS_LIST_HISTORY, "is_master")
        ]);
    }
};

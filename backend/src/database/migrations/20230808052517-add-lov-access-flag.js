"use strict";

const { ALL_MASTERS_LIST, ALL_MASTERS_LIST_HISTORY } = require("../../config/database-schema");
 
module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([

            // add column in the history table
            queryInterface.addColumn(
                ALL_MASTERS_LIST,
                "lov_access",
                {
                    type: Sequelize.BOOLEAN,
                    field: "lov_access",
                    defaultValue: false
    
                }
            ),

            // add column in the history table
            queryInterface.addColumn(
                ALL_MASTERS_LIST_HISTORY,
                "lov_access",
                {
                    type: Sequelize.BOOLEAN,
                    field: "lov_access",
                    defaultValue: false
                }
            )
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            // ROLLBACK OF MAIN TABLE
            queryInterface.removeColumn(ALL_MASTERS_LIST, "lov_access"),

            // ROLLBACK OF HISTORY TABLE,
            queryInterface.removeColumn(ALL_MASTERS_LIST_HISTORY, "lov_access")
        ]);
    }
};

"use strict";

const { GAA_LEVEL_ENTRIES, GAA_LEVEL_ENTRIES_HISTORY, GAA_HIERARCHIES, GAA_HIERARCHIES_HISTORY } = require("../../config/database-schema");
 
module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([

            // add column in the history table
            queryInterface.addColumn(
                GAA_LEVEL_ENTRIES,
                "parent_id",
                {
                    type: Sequelize.UUID,
                    field: "parent_id",
                    references: {
                        model: GAA_LEVEL_ENTRIES,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                GAA_HIERARCHIES,
                "level_type",
                {
                    type: Sequelize.STRING,
                    field: "level_type"
                }
            ),

            // add column in the history table
            queryInterface.addColumn(
                GAA_LEVEL_ENTRIES_HISTORY,
                "parent_id",
                {
                    type: Sequelize.UUID,
                    field: "parent_id"
                }
            ),
            queryInterface.addColumn(
                GAA_HIERARCHIES_HISTORY,
                "level_type",
                {
                    type: Sequelize.STRING,
                    field: "level_type"
                }
            )
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            // ROLLBACK OF MAIN TABLE
            queryInterface.removeColumn(GAA_LEVEL_ENTRIES, "parent_id"),
            queryInterface.removeColumn(GAA_HIERARCHIES, "level_type"),

            // ROLLBACK OF HISTORY TABLE,
            queryInterface.removeColumn(GAA_LEVEL_ENTRIES_HISTORY, "parent_id"),
            queryInterface.removeColumn(GAA_HIERARCHIES_HISTORY, "level_type")
        ]);
    }
};
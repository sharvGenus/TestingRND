"use strict";

const { ALL_MASTERS_LIST, ALL_MASTERS_LIST_HISTORY } = require("../../config/database-schema");
 
module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([

            // updations in the main table
            queryInterface.addColumn(
                ALL_MASTERS_LIST,
                "rank",
                {
                    type: Sequelize.INTEGER,
                    field: "rank"
                }
            ),
            queryInterface.addColumn(
                ALL_MASTERS_LIST,
                "grand_parent_id",
                {
                    type: Sequelize.UUID,
                    field: "grand_parent_id"
                }
            ),
            queryInterface.addColumn(
                ALL_MASTERS_LIST,
                "parent_id",
                {
                    type: Sequelize.UUID,
                    field: "parent_id"
                }
            ),
            queryInterface.changeColumn(ALL_MASTERS_LIST, "parent", {
                type: Sequelize.STRING,
                field: "parent",
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.changeColumn(ALL_MASTERS_LIST, "grand_parent", {
                type: Sequelize.STRING,
                field: "grand_parent",
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.changeColumn(ALL_MASTERS_LIST, "parent_rank", {
                type: Sequelize.INTEGER,
                field: "parent_rank",
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.changeColumn(ALL_MASTERS_LIST, "grand_parent_rank", {
                type: Sequelize.INTEGER,
                field: "grand_parent_rank",
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.changeColumn(ALL_MASTERS_LIST, "name", {
                type: Sequelize.STRING,
                field: "name",
                allowNull: true,
                defaultValue: null
            }),

            // updations in the history table
            queryInterface.addColumn(
                ALL_MASTERS_LIST_HISTORY,
                "rank",
                {
                    type: Sequelize.INTEGER,
                    field: "rank"
                }
            ),
            queryInterface.addColumn(
                ALL_MASTERS_LIST_HISTORY,
                "grand_parent_id",
                {
                    type: Sequelize.UUID,
                    field: "grand_parent_id"
                }
            ),
            queryInterface.addColumn(
                ALL_MASTERS_LIST_HISTORY,
                "parent_id",
                {
                    type: Sequelize.UUID,
                    field: "parent_id"
                }
            )
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return Promise.all([

            // ROLLBACK OF MAIN TABLES
            queryInterface.removeColumn(ALL_MASTERS_LIST, "rank"),
            queryInterface.removeColumn(ALL_MASTERS_LIST, "parent_id"),
            queryInterface.removeColumn(ALL_MASTERS_LIST, "grand_parent_id"),
            queryInterface.changeColumn(ALL_MASTERS_LIST, "parent", {
                type: Sequelize.STRING,
                field: "parent",
                allowNull: false
            }),
            queryInterface.changeColumn(ALL_MASTERS_LIST, "grand_parent", {
                type: Sequelize.STRING,
                field: "grand_parent",
                allowNull: false
            }),
            queryInterface.changeColumn(ALL_MASTERS_LIST, "parent_rank", {
                type: Sequelize.INTEGER,
                field: "parent_rank",
                allowNull: false
            }),
            queryInterface.changeColumn(ALL_MASTERS_LIST, "grand_parent_rank", {
                type: Sequelize.INTEGER,
                field: "grand_parent_rank",
                allowNull: false
            }),
            queryInterface.changeColumn(ALL_MASTERS_LIST, "name", {
                type: Sequelize.STRING,
                field: "name",
                allowNull: false
            }),

            // ROLLBACK OF HISTORY TABLES
            queryInterface.removeColumn(ALL_MASTERS_LIST_HISTORY, "rank"),
            queryInterface.removeColumn(ALL_MASTERS_LIST_HISTORY, "parent_id"),
            queryInterface.removeColumn(ALL_MASTERS_LIST_HISTORY, "grand_parent_id")

        ]);
    }
};

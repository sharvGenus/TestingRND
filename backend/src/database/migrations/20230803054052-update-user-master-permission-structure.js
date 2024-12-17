"use strict";

const { USER_MASTER_PERMISSIONS, ALL_MASTERS_LIST } = require("../../config/database-schema");
 
module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([

            // updations in the main table
            queryInterface.addColumn(
                USER_MASTER_PERMISSIONS,
                "parent_id",
                {
                    type: Sequelize.UUID,
                    field: "parent_id",
                    references: {
                        model: ALL_MASTERS_LIST,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                USER_MASTER_PERMISSIONS,
                "grand_parent_id",
                {
                    type: Sequelize.UUID,
                    field: "grand_parent_id",
                    references: {
                        model: ALL_MASTERS_LIST,
                        key: "id"
                    }
                }
            ),
            queryInterface.changeColumn(USER_MASTER_PERMISSIONS, "add", {
                type: Sequelize.BOOLEAN,
                field: "add",
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.changeColumn(USER_MASTER_PERMISSIONS, "view", {
                type: Sequelize.BOOLEAN,
                field: "view",
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.changeColumn(USER_MASTER_PERMISSIONS, "edit", {
                type: Sequelize.BOOLEAN,
                field: "edit",
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.changeColumn(USER_MASTER_PERMISSIONS, "delete", {
                type: Sequelize.BOOLEAN,
                field: "delete",
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(USER_MASTER_PERMISSIONS, "parent_id"),
            queryInterface.removeColumn(USER_MASTER_PERMISSIONS, "grand_parent_id"),
            queryInterface.changeColumn(USER_MASTER_PERMISSIONS, "add", {
                type: Sequelize.STRING,
                field: "parent",
                allowNull: false
            }),
            queryInterface.changeColumn(USER_MASTER_PERMISSIONS, "view", {
                type: Sequelize.STRING,
                field: "parent",
                allowNull: false
            }),
            queryInterface.changeColumn(USER_MASTER_PERMISSIONS, "update", {
                type: Sequelize.STRING,
                field: "parent",
                allowNull: false
            }),
            queryInterface.changeColumn(USER_MASTER_PERMISSIONS, "delete", {
                type: Sequelize.STRING,
                field: "parent",
                allowNull: false
            })
        ]);
    }
};
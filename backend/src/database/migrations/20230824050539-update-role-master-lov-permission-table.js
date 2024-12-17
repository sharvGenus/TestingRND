"use strict";

const { ROLE_MASTER_LOV_PERMISSIONS } = require("../../config/database-schema");
 
module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                ROLE_MASTER_LOV_PERMISSIONS,
                "is_all_rows_governed",
                {
                    type: Sequelize.BOOLEAN,
                    field: "is_all_rows_governed"
                }
            ),
            queryInterface.addColumn(
                ROLE_MASTER_LOV_PERMISSIONS,
                "lov_array",
                {
                    type: Sequelize.ARRAY(Sequelize.UUID),
                    field: "lov_array"
                }
            ),

            queryInterface.changeColumn(ROLE_MASTER_LOV_PERMISSIONS, "view", {
                type: Sequelize.BOOLEAN,
                allowNull: true
            }),

            queryInterface.changeColumn(ROLE_MASTER_LOV_PERMISSIONS, "edit", {
                type: Sequelize.BOOLEAN,
                allowNull: true
            }),

            queryInterface.changeColumn(ROLE_MASTER_LOV_PERMISSIONS, "add", {
                type: Sequelize.BOOLEAN,
                allowNull: true
            }),

            queryInterface.changeColumn(ROLE_MASTER_LOV_PERMISSIONS, "delete", {
                type: Sequelize.BOOLEAN,
                allowNull: true
            })
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(ROLE_MASTER_LOV_PERMISSIONS, "is_all_rows_governed"),
            queryInterface.removeColumn(ROLE_MASTER_LOV_PERMISSIONS, "lov_array"),

            queryInterface.changeColumn(ROLE_MASTER_LOV_PERMISSIONS, "view", {
                type: Sequelize.BOOLEAN,
                allowNull: false
            }),

            queryInterface.changeColumn(ROLE_MASTER_LOV_PERMISSIONS, "edit", {
                type: Sequelize.BOOLEAN,
                allowNull: false
            }),

            queryInterface.changeColumn(ROLE_MASTER_LOV_PERMISSIONS, "add", {
                type: Sequelize.BOOLEAN,
                allowNull: false
            }),

            queryInterface.changeColumn(ROLE_MASTER_LOV_PERMISSIONS, "delete", {
                type: Sequelize.BOOLEAN,
                allowNull: false
            })
        ]);
    }
};

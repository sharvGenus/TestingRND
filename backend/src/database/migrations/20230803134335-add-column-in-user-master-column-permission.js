"use strict";

const { USER_MASTER_COLUMN_PERMISSION } = require("../../config/database-schema");
 
module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                USER_MASTER_COLUMN_PERMISSION,
                "columns_array",
                {
                    type: Sequelize.ARRAY(Sequelize.UUID),
                    field: "columns_array"
                }
            )
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(USER_MASTER_COLUMN_PERMISSION, "columns_array")
        ]);
    }
};
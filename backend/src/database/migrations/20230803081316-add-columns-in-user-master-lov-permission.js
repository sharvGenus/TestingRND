"use strict";

const { USER_MASTER_LOV_PERMISSION } = require("../../config/database-schema");
 
module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                USER_MASTER_LOV_PERMISSION,
                "is_all_rows_governed",
                {
                    type: Sequelize.BOOLEAN,
                    field: "is_all_rows_governed"
                }
            ),
            queryInterface.addColumn(
                USER_MASTER_LOV_PERMISSION,
                "lov_array",
                {
                    type: Sequelize.ARRAY(Sequelize.UUID),
                    field: "lov_array"
                }
            )
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(USER_MASTER_LOV_PERMISSION, "is_all_rows_governed"),
            queryInterface.removeColumn(USER_MASTER_LOV_PERMISSION, "lov_array")
        ]);
    }
};
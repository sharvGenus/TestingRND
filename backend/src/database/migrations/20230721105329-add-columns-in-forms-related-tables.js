"use strict";

const { FORMS, FORM_ATTRIBUTES, ALL_MASTERS_LIST, ALL_MASTER_COLUMNS_LIST } = require("../../config/database-schema");
 
module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                FORMS,
                "search_columns",
                {
                    type: Sequelize.ARRAY(Sequelize.UUID),
                    field: "search_columns"
                }
            ),
            queryInterface.addColumn(
                FORMS,
                "mapping_table_id",
                {
                    type: Sequelize.UUID,
                    field: "mapping_table_id",
                    references: {
                        model: ALL_MASTERS_LIST,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                FORMS,
                "total_counts",
                {
                    type: Sequelize.INTEGER,
                    field: "total_counts",
                    defaultValue: 0
                }
            ),
            queryInterface.addColumn(
                FORMS,
                "approved_counts",
                {
                    type: Sequelize.INTEGER,
                    field: "approved_counts",
                    defaultValue: 0
                }
            ),
            queryInterface.addColumn(
                FORMS,
                "rejected_counts",
                {
                    type: Sequelize.INTEGER,
                    field: "rejected_counts",
                    defaultValue: 0
                }
            ),
            queryInterface.addColumn(
                FORM_ATTRIBUTES,
                "mapping_column_id",
                {
                    type: Sequelize.UUID,
                    field: "mapping_column_id",
                    references: {
                        model: ALL_MASTER_COLUMNS_LIST,
                        key: "id"
                    }
                }
            )
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeConstraint(FORMS, "forms_mapping_table_id_fkey"),
            queryInterface.removeConstraint(FORM_ATTRIBUTES, "form_attributes_mapping_column_id_fkey"),
            queryInterface.removeColumn(FORMS, "search_columns"),
            queryInterface.removeColumn(FORMS, "mapping_table_id"),
            queryInterface.removeColumn(FORMS, "total_counts"),
            queryInterface.removeColumn(FORMS, "approved_counts"),
            queryInterface.removeColumn(FORMS, "rejected_counts"),
            queryInterface.removeColumn(FORM_ATTRIBUTES, "mapping_column_id")
        ]);
    }
};

"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint(
            config.FORM_ATTRIBUTES,
            "form_attributes_mapping_column_id_fkey"
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addConstraint(config.FORM_ATTRIBUTES, {
            fields: ["mapping_column_id"],
            type: "foreign key",
            name: "form_attributes_mapping_column_id_fkey",
            references: {
                table: "all_master_columns",

                field: "id",
            },
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        });
    },
};

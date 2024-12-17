"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeConstraint(
            config.FORMS,
            "forms_mapping_table_id_fkey"
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addConstraint(config.FORMS, {
            fields: ["mapping_table_id"],

            type: "foreign key",

            name: "forms_mapping_table_id_fkey",

            references: {
                table: "all_masters_list",

                field: "id",
            },

            onDelete: "NO ACTION",

            onUpdate: "NO ACTION",
        });
    },
};

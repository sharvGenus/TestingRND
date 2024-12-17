"use strict";

const config = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addIndex(
                config.GAA_LEVEL_ENTRIES,
                ["name", "code", "gaa_hierarchy_id"],
                {
                    name: "idx_name_code_gaa"
                }
            ),
            queryInterface.addIndex(
                config.PROJECT_MASTER_MAKER_LOVS,
                ["name", "code", "master_id"],
                {
                    name: "idx_name_code_master_project"
                }
            ),
            queryInterface.addIndex(
                config.MASTER_MAKER_LOVS,
                ["name", "code", "master_id"],
                {
                    name: "idx_name_code_master"
                }
            ),
            queryInterface.addIndex(
                config.FORM_ATTRIBUTES,
                ["form_id"],
                {
                    name: "idx_formid"
                }
            )
        ]);
    },

    async down(queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.removeIndex(config.GAA_LEVEL_ENTRIES, "idx_name_code_gaa"),
            queryInterface.removeIndex(config.PROJECT_MASTER_MAKER_LOVS, "idx_name_code_master_project"),
            queryInterface.removeIndex(config.FORM_ATTRIBUTES, "idx_formid"),
            queryInterface.removeIndex(config.MASTER_MAKER_LOVS, "idx_name_code_master")
        ]);
    }
};
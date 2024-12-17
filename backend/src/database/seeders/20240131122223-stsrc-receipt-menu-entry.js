"use strict";

/** @type {import('sequelize-cli').Migration} */

const path = require("path");
const { ALL_MASTERS_LIST } = require("../../config/database-schema");

const schemaName = "public";
const { seedFromCsv } = require("../services/run-seeder");

module.exports = {
    async up(queryInterface, Sequelize) {
        const file = path.join(__dirname, "csv", path.basename(__filename).replace(".js", ".csv"));
        const map = function (_data) {
            return {
                id: _data[0],
                name: _data[1] || null,
                visible_name: _data[2],
                access_flag: _data[3] || null,
                is_active: _data[4],
                created_at: _data[5],
                updated_at: _data[6],
                rank: _data[7],
                parent_id: _data[8] || null,
                grand_parent_id: _data[9] || null,
                is_master: _data[10] || false,
                lov_access: _data[11] || false,
                master_route: _data[12] || null,
                table_type: _data[13] || null
            };
        };
        return seedFromCsv(queryInterface, ALL_MASTERS_LIST, file, map);

    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`DELETE FROM ${schemaName}.${ALL_MASTERS_LIST} WHERE id = 'dff05971-5b5c-4cf7-ad36-c7d5e9bbbdea'`);
    }
};

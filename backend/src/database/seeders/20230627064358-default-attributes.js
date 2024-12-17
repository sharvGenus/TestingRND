"use strict";

/**
 * A sample migration to create table and insert data from csv keep this file for future reference
 */

const path = require("path");
const { seedFromCsv } = require("../services/run-seeder");
const { DEFAULT_ATTRIBUTES } = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        const file = path.join(__dirname, "csv", path.basename(__filename).replace(".js", ".csv"));
        const map = function (_data) {
            return {
                id: _data[0],
                name: _data[1],
                type: _data[2],
                updated_at: _data[3],
                created_at: _data[4],
                input_type: _data[5],
                rank: _data[6],
                is_active: "1"
            };
        };
        return seedFromCsv(queryInterface, DEFAULT_ATTRIBUTES, file, map);
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete(DEFAULT_ATTRIBUTES, null, {});
    }
};

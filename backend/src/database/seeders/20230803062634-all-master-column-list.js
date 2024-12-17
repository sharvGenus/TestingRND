"use strict";

/**
 * Migration to create table and insert data from csv
 */

const path = require("path");
const { seedFromCsv } = require("../services/run-seeder");
const { ALL_MASTER_COLUMNS_LIST } = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        const file = path.join(__dirname, "csv", path.basename(__filename).replace(".js", ".csv"));
        const map = function (_data) {
            return {
                id: _data[0],
                master_id: _data[1],
                name: _data[2],
                visible_name: _data[3],
                is_active: _data[4],
                updated_at: _data[5],
                created_at: _data[6]

            };
        };
        return seedFromCsv(queryInterface, ALL_MASTER_COLUMNS_LIST, file, map);
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete(ALL_MASTER_COLUMNS_LIST, null, {});
    }
};

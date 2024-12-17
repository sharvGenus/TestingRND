"use strict";

/**
 * Migration to create table and insert data from csv
 */

const path = require("path");
const { seedFromCsv } = require("../services/run-seeder");
const { MASTER_MAKER_LOVS } = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        const file = path.join(__dirname, "csv", path.basename(__filename).replace(".js", ".csv"));
        const map = function (_data) {
            return {
                master_id: _data[0],
                id: _data[1],
                name: _data[2],
                updated_at: _data[3],
                created_at: _data[4],
                is_active: "1"
            };
        };
        return seedFromCsv(queryInterface, MASTER_MAKER_LOVS, file, map);
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete(MASTER_MAKER_LOVS, null, {});
    }
};

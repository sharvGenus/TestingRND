"use strict";

/**
 * Migration to create table and insert data from csv
 */

const path = require("path");
const { seedFromCsv } = require("../services/run-seeder");
const { MASTER_MAKERS } = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        const file = path.join(__dirname, "csv", path.basename(__filename).replace(".js", ".csv"));
        const map = function (_data) {
            return {
                id: _data[0],
                name: _data[1],
                updated_at: _data[2],
                created_at: _data[3],
                is_active: "1"
            };
        };
        return seedFromCsv(queryInterface, MASTER_MAKERS, file, map);
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete(MASTER_MAKERS, null, {});
    }
};

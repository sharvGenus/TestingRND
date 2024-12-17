"use strict";

/**
 * Migration to create table and insert data from csv
 */

const path = require("path");
const { seedFromCsv } = require("../services/run-seeder");
const { ROLES } = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        const file = path.join(__dirname, "csv", path.basename(__filename).replace(".js", ".csv"));
        const map = function (_data) {
            return {
                id: _data[0],
                name: _data[1] || null,
                description: _data[2],
                code: _data[3],
                is_active: "1"

            };
        };
        return seedFromCsv(queryInterface, ROLES, file, map);
    },
    down: function (queryInterface, Sequelize) {
        queryInterface.sequelize.query(
            "DELETE FROM roles where id = 'a89c1591-ed87-40e5-b89b-e409d647e3e5'"
        );
    }
};
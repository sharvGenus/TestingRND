"use strict";

/**
 * Migration to create table and insert data from csv
 */

const path = require("path");
const { seedFromCsv } = require("../services/run-seeder");
const { ALL_MASTERS_LIST } = require("../../config/database-schema");

module.exports = {
    up: function (queryInterface, Sequelize) {
        const file = path.join(__dirname, "csv", path.basename(__filename).replace(".js", ".csv"));
        const map = function (_data) {
            return {
                id: _data[0],
                name: _data[1] || null,
                visible_name: _data[2],
                access_flag: _data[3] || null,
                updated_at: _data[4],
                created_at: _data[5],
                grand_parent_id: _data[6] || null,
                rank: _data[7],
                parent_id: _data[8] || null,
                is_master: _data[9] || false,
                lov_access: _data[10] || false,
                master_route: _data[11] || null,
                is_active: "1"
            };
        };
        return seedFromCsv(queryInterface, ALL_MASTERS_LIST, file, map);
    },
    down: function (queryInterface, Sequelize) {
        queryInterface.sequelize.query(`DELETE FROM public.${ALL_MASTERS_LIST} WHERE id IN (
            'ea926d43-4b5f-4667-b306-865467346bb5', 'c8b1bd5c-796d-4146-b318-23541d6d2e52', '511cf1bf-bf0a-40d4-8497-5b8a536acc31', 'bd21c7a2-c96c-4e00-acdc-d993235ddc07', '2e8f3a8e-d816-45dd-bd97-dfc3a949ee02'
        );`);
    }
};

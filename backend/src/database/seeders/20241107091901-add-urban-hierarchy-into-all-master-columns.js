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
        queryInterface.sequelize.query(`DELETE FROM public.${ALL_MASTER_COLUMNS_LIST} WHERE id IN (
            '00-42a7-93bf-a4cda1c87c49', 'f5-456f-b8ae-71e3d376cce5', '88-4c0e-b1ed-dd6b5358e177', 'd0-487d-af95-e6221dc1a7a9', '93-4d3d-bd62-0c6dc8799471', '23-4e00-8ef0-e988c3efdc15', '5c-4c84-a61e-00da0726a847', '5a-45d8-b717-00055f34031a', '8d-4105-9c12-884240cb805a', '27-468b-998e-527c26811655', 'e6-4a75-8158-284b982482f2', 'b2-4122-b8e3-0ad30338538d', '98-470b-96d4-0b49cad466b3', 'e6-4ce9-a5b3-52cb3124afef', 'd0-47d5-99e2-4d4d34db2cf6', 'a8-4595-a351-67f1193f411a', 'a5-4831-b4fe-0819fa736e5e', 'e6-44fe-b342-539c5b7137e3'
        );`);
    }
};

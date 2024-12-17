"use strict";

const path = require("path");
const { seedFromCsv } = require("../services/run-seeder");
const { ALL_MASTERS_LIST } = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // insert new masters from CSV
        const file = path.join(__dirname, "csv", path.basename(__filename).replace(".js", ".csv"));
        const map = function (_data) {
            let i = 0;
            // eslint-disable-next-line no-return-assign
            const next = (step = 1) => _data[i += step];

            return {
                id: next(0),
                visible_name: next(),
                access_flag: next(),
                is_active: next(),
                created_at: next(),
                updated_at: next(),
                rank: next(),
                parent_id: next(),
                grand_parent_id: next(),
                is_master: next(),
                lov_access: next(),
                master_route: next(),
                table_type: next()
            };
        };
        await seedFromCsv(queryInterface, ALL_MASTERS_LIST, file, map);
    },

    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`DELETE FROM public.${ALL_MASTERS_LIST} WHERE id IN (5a5e796b-d7c8-4915-9215-d36e5c079f44
            9844f817-8e0c-49e1-a15d-ca44865ddf74
            a03e40d7-0710-4e54-8cc3-50e5c1c51c57
            34ad1fa7-8a9e-4765-86a7-48533945f7e5
            );`);
    }
};

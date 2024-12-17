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
            const next = (step = 1) => i += step;
            return {
                id: _data[next(0)],

                name: _data[next()] || null,
                visible_name: _data[next()],

                parent_id: _data[next()] || null,
                grand_parent_id: _data[next()] || null,

                rank: _data[next()],

                is_master: _data[next()] || false,
                lov_access: _data[next()] || false,
                access_flag: _data[next()] || null,

                master_route: _data[next()] || null,

                updated_at: _data[next()],
                created_at: _data[next()],

                table_type: "table",
                is_active: "1"
            };
        };
        await seedFromCsv(queryInterface, ALL_MASTERS_LIST, file, map);
    },

    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`DELETE FROM public.${ALL_MASTERS_LIST} WHERE id IN ('b1d4e5a8-6f42-4b78-9c71-0b0d6c57b6c5');`);
    }
};

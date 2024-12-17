"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addColumn(
                config.MATERIAL_SERIAL_NUMBERS,
                "material_id",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.MATERIALS,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                config.MATERIAL_SERIAL_NUMBERS_HISTORY,
                "material_id",
                {
                    type: Sequelize.UUID
                }
            )
        ]);
        await queryInterface.sequelize.query(`
        UPDATE material_serial_numbers
        SET material_id = (
          SELECT material_id
          FROM stock_ledgers
          WHERE stock_ledgers.id = material_serial_numbers.stock_ledger_id
        )
      `);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(config.MATERIAL_SERIAL_NUMBERS, "material_id"),
            queryInterface.removeColumn(config.MATERIAL_SERIAL_NUMBERS_HISTORY, "material_id")
        ]);
    }
};
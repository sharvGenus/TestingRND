"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addColumn(
                config.TRANSACTION_TYPE_RANGES,
                "name",
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.addColumn(
                config.TRANSACTION_TYPE_RANGES_HISTORY,
                "name",
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.addColumn(
                config.TRANSACTION_TYPE_RANGES,
                "transaction_type_ids",
                {
                    type: Sequelize.ARRAY(Sequelize.UUID)
                }
            ),
            queryInterface.addColumn(
                config.TRANSACTION_TYPE_RANGES_HISTORY,
                "transaction_type_ids",
                {
                    type: Sequelize.ARRAY(Sequelize.UUID)
                }
            )
        ]);
        const rows = await queryInterface.sequelize.query("SELECT id, transaction_type_id FROM transaction_type_ranges");
        for await (const row of rows[0]) {
            if (row.transaction_type_id) {
                await queryInterface.sequelize.query(`UPDATE transaction_type_ranges SET transaction_type_ids = ARRAY['${row.transaction_type_id}']::UUID[] WHERE id = '${row.id}'`);
            }
        }
        const rowsHistory = await queryInterface.sequelize.query("SELECT id, transaction_type_id FROM transaction_type_ranges_history");
        for await (const rowHistory of rowsHistory[0]) {
            if (rowHistory.transaction_type_id) {
                await queryInterface.sequelize.query(`UPDATE transaction_type_ranges_history SET transaction_type_ids = ARRAY['${rowHistory.transaction_type_id}']::UUID[] WHERE id = '${rowHistory.id}'`);
            }
        }
        await Promise.all([
            queryInterface.removeColumn(config.TRANSACTION_TYPE_RANGES, "transaction_type_id"),
            queryInterface.removeColumn(config.TRANSACTION_TYPE_RANGES_HISTORY, "transaction_type_id")
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.TRANSACTION_TYPE_RANGES,
                "transaction_type_id",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                config.TRANSACTION_TYPE_RANGES_HISTORY,
                "transaction_type_id",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.MASTER_MAKER_LOVS,
                        key: "id"
                    }
                }
            ),
            queryInterface.removeColumn(config.TRANSACTION_TYPE_RANGES, "name"),
            queryInterface.removeColumn(config.TRANSACTION_TYPE_RANGES_HISTORY, "name"),
            queryInterface.removeColumn(config.TRANSACTION_TYPE_RANGES, "transaction_type_ids"),
            queryInterface.removeColumn(config.TRANSACTION_TYPE_RANGES_HISTORY, "transaction_type_ids")
        ]);
    }
};
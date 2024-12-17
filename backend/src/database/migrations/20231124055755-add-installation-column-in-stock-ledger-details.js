"use strict";
 
const config = require("../../config/database-schema");
 
async function addColumnIfNotExists(
    queryInterface,
    tableDescription,
    tableName,
    columnName,
    columnDefinition
) {
    if (tableDescription[columnName]) {
        return Promise.resolve();
    } else {
        return queryInterface.addColumn(
            tableName,
            columnName,
            columnDefinition
        );
    }
}
 
module.exports = {
    up: async function (queryInterface, Sequelize) {
        const [stockLedgerDetails, stockLedgerDetailsHistory] = await Promise.all([
            queryInterface.describeTable(config.STOCK_LEDGER_DETAILS),
            queryInterface.describeTable(
                config.STOCK_LEDGER_DETAILS_HISTORY
            )
        ]);
 
        return Promise.all([
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetails,
                config.STOCK_LEDGER_DETAILS,
                "brand_master_id",
                {
                    type: Sequelize.UUID,
                    field: "brand_master_id"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetails,
                config.STOCK_LEDGER_DETAILS,
                "project_id",
                {
                    type: Sequelize.UUID,
                    field: "project_id"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetails,
                config.STOCK_LEDGER_DETAILS,
                "installer_id",
                {
                    type: Sequelize.UUID,
                    field: "installer_id"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetails,
                config.STOCK_LEDGER_DETAILS,
                "serial_number_id",
                {
                    type: Sequelize.STRING,
                    field: "serial_number_id"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetails,
                config.STOCK_LEDGER_DETAILS,
                "capitalize",
                {
                    type: Sequelize.BOOLEAN,
                    field: "capitalize"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetails,
                config.STOCK_LEDGER_DETAILS,
                "brand_name",
                {
                    type: Sequelize.UUID,
                    field: "brand_name"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetails,
                config.STOCK_LEDGER_DETAILS,
                "non_serialize_material_id",
                {
                    type: Sequelize.UUID,
                    field: "non_serialize_material_id"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetails,
                config.STOCK_LEDGER_DETAILS,
                "quantity",
                {
                    type: Sequelize.STRING,
                    field: "quantity"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetails,
                config.STOCK_LEDGER_DETAILS,
                "cancel_ref_doc_no",
                {
                    type: Sequelize.STRING,
                    field: "cancel_ref_doc_no"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetails,
                config.STOCK_LEDGER_DETAILS,
                "is_cancelled",
                {
                    type: Sequelize.BOOLEAN,
                    field: "is_cancelled",
                    allowNull: false,
                    defaultValue: false
                }
            ),
 
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetailsHistory,
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "brand_master_id",
                {
                    type: Sequelize.UUID,
                    field: "brand_master_id"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetailsHistory,
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "project_id",
                {
                    type: Sequelize.UUID,
                    field: "project_id"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetailsHistory,
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "installer_id",
                {
                    type: Sequelize.UUID,
                    field: "installer_id"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetailsHistory,
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "serial_number_id",
                {
                    type: Sequelize.STRING,
                    field: "serial_number_id"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetailsHistory,
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "capitalize",
                {
                    type: Sequelize.BOOLEAN,
                    field: "capitalize"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetailsHistory,
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "brand_name",
                {
                    type: Sequelize.UUID,
                    field: "brand_name"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetailsHistory,
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "non_serialize_material_id",
                {
                    type: Sequelize.UUID,
                    field: "non_serialize_material_id"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetailsHistory,
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "quantity",
                {
                    type: Sequelize.STRING,
                    field: "quantity"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetailsHistory,
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "cancel_ref_doc_no",
                {
                    type: Sequelize.STRING,
                    field: "cancel_ref_doc_no"
                }
            ),
            addColumnIfNotExists(
                queryInterface,
                stockLedgerDetailsHistory,
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "is_cancelled",
                {
                    type: Sequelize.BOOLEAN,
                    field: "is_cancelled",
                    allowNull: false,
                    defaultValue: false
                }
            )
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "brand_master_id"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "project_id"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "installer_id"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "serial_number_id"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "capitalize"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "brand_name"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "non_serialize_material_id"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "quantity"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "cancel_ref_doc_no"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS,
                "is_cancelled"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "brand_master_id"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "project_id"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "installer_id"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "serial_number_id"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "capitalize"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "brand_name"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "non_serialize_material_id"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "quantity"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "cancel_ref_doc_no"
            ),
            queryInterface.removeColumn(
                config.STOCK_LEDGER_DETAILS_HISTORY,
                "is_cancelled"
            )
        ]);
    }
};
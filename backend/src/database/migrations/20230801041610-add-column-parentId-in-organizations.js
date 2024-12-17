"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.changeColumn(
                config.ORGANIZATIONS,
                "registered_office_address",

                {
                    type: Sequelize.STRING,
                    allowNull: true,
                    defaultValue: null
                }
            ),
            queryInterface.changeColumn(
                config.ORGANIZATIONS,
                "registered_office_pincode",
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                    defaultValue: null
                }
            ),
            queryInterface.addColumn(
                config.ORGANIZATIONS,
                "parent_id",
                {
                    type: Sequelize.UUID,
                    references: {
                        model: config.ORGANIZATIONS,
                        key: "id"
                    }
                }
            ),
            queryInterface.changeColumn(
                config.ORGANIZATIONS_HISTORY,
                "registered_office_address",
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                    defaultValue: null
                }
            ),
            queryInterface.changeColumn(
                config.ORGANIZATIONS_HISTORY,
                "registered_office_pincode",

                {
                    type: Sequelize.STRING,
                    allowNull: true,
                    defaultValue: null
                }
            ),
            queryInterface.addColumn(
                config.ORGANIZATIONS_HISTORY,
                "parent_id",
                {
                    type: Sequelize.UUID
                }
            )
        ]);
    },
    down: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.changeColumn(
                config.ORGANIZATIONS,
                "registered_office_address",
                {
                    type: Sequelize.STRING,
                    allowNull: false
                }
            ),
            queryInterface.changeColumn(
                config.ORGANIZATIONS,
                "registered_office_pincode",
                {
                    type: Sequelize.STRING,
                    allowNull: false
                }
            ),
            queryInterface.removeColumn(
                config.ORGANIZATIONS,
                "parent_id"
            ),
            queryInterface.changeColumn(
                config.ORGANIZATIONS_HISTORY,
                "registered_office_address",
                {
                    type: Sequelize.STRING,
                    allowNull: false
                }
            ),
            queryInterface.changeColumn(
                config.ORGANIZATIONS_HISTORY,
                "registered_office_pincode",

                {
                    type: Sequelize.STRING,
                    allowNull: false
                }
            ),
            queryInterface.removeColumn(
                config.ORGANIZATIONS_HISTORY,
                "parent_id"
            )
        ]);
    }
};
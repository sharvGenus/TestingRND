"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`CALL create_history_table('public', '${config.DEVOLUTION_CONFIGS}')`);

    },
    down: async function (queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`TRUNCATE TABLE ${config.DEVOLUTION_CONFIGS};`);
    }
};
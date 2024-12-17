"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`CALL create_history_table('public', '${config.DAILY_EXECUTION_PLANS}')`);

    },
    down: async function (queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`TRUNCATE TABLE ${config.DAILY_EXECUTION_PLANS};`);
    }
};

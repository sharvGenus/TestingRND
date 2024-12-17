"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`CALL create_history_table('public', '${config.PROJECT_WISE_TICKET_MAPPINGS}')`);

    },
    down: async function (queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`TRUNCATE TABLE ${config.PROJECT_WISE_TICKET_MAPPINGS};`);
    }
};

"use strict";

const config = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addColumn(config.TICKETS, "attachments", {
                type: Sequelize.ARRAY(Sequelize.STRING),
                field: "attachments"
            }),
            queryInterface.addColumn(config.TICKETS_HISTORY, "attachments", {
                type: Sequelize.ARRAY(Sequelize.STRING),
                field: "attachments"
            })
        ]);
    },

    async down(queryInterface, Sequelize) {
        queryInterface.removeColumn(config.TICKETS, "attachments");
        queryInterface.removeColumn(config.TICKETS_HISTORY, "attachments");
    }
};

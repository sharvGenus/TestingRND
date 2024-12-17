"use strict";

const { USERS, USERS_HISTORY } = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(USERS, "wfm_code", {
            type: Sequelize.INTEGER,
            allowNull: true
        });

        await queryInterface.addColumn(USERS, "source", {
            type: Sequelize.STRING,
            allowNull: true
        });

        await queryInterface.addColumn(USERS_HISTORY, "wfm_code", {
            type: Sequelize.INTEGER,
            allowNull: true
        });

        await queryInterface.addColumn(USERS_HISTORY, "source", {
            type: Sequelize.STRING,
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn(USERS, "wfm_code");
        await queryInterface.removeColumn(USERS_HISTORY, "wfm_code");

        await queryInterface.removeColumn(USERS, "source");
        await queryInterface.removeColumn(USERS_HISTORY, "source");
    }
};

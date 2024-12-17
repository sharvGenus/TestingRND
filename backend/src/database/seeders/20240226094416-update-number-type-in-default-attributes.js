"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
            UPDATE default_attributes SET type = 'double precision' WHERE id = '55be9f78-4514-4e36-b9b3-0fb904c5555b';
		`);
    },
    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
            UPDATE default_attributes SET type = 'text' WHERE id = '55be9f78-4514-4e36-b9b3-0fb904c5555b';
        `);
    }
};

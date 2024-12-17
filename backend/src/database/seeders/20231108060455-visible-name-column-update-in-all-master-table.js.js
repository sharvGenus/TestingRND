"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
		UPDATE all_masters_list SET visible_name='Project Site Store to Customer(STC)' WHERE id='50599a7c-d235-4cb2-88cf-7a7f81007c4a';
		UPDATE all_masters_list SET visible_name='Customer to Project Site Store(CTS)' WHERE id='57286d60-26cf-4fbe-8a2b-6067b2b5c845';
        `);
    },
    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
		UPDATE all_masters_list SET visible_name='Project Site Store to Customer(STC)' WHERE id='50599a7c-d235-4cb2-88cf-7a7f81007c4a';
		UPDATE all_masters_list SET visible_name='Customer to Project Site Store(CTS)' WHERE id='57286d60-26cf-4fbe-8a2b-6067b2b5c845';
        `);
    }
};
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
            UPDATE all_masters_list SET name = 'forms' WHERE id = '65b01aaf-46ab-468c-b6bd-4fa72a2f089a';
		`);
    },
    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
            UPDATE all_masters_list SET name = null WHERE id = '65b01aaf-46ab-468c-b6bd-4fa72a2f089a';
        `);
    }
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
            UPDATE all_masters_list SET visible_name = 'Configure Ticket' WHERE id = 'd1bc3a9e-a12b-4863-b922-b3f10c7077c9';
            UPDATE all_masters_list SET visible_name = 'Create Ticket' WHERE id = 'd1bc3a9e-a12b-4863-b922-b3f10c5055c7';
          `);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
            UPDATE all_masters_list SET visible_name = 'Ticket Configurator' WHERE id = 'd1bc3a9e-a12b-4863-b922-b3f10c7077c9';
            UPDATE all_masters_list SET visible_name = 'Ticket List' WHERE id = 'd1bc3a9e-a12b-4863-b922-b3f10c5055c7';
          `);
    },
};

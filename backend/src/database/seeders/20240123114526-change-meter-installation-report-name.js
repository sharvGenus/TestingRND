"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
      UPDATE all_masters_list
      SET visible_name = 'Installation Reports'
      WHERE id = '04ca030a-01ff-436c-8626-a1a3632ec760';

    `);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
      UPDATE all_masters_list
      SET visible_name = 'Meter Installation Reports'
      WHERE id = '04ca030a-01ff-436c-8626-a1a3632ec760';

    `);
    },
};

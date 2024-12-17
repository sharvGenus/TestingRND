"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
          INSERT INTO default_attributes (id, name, type, input_type, rank)
          VALUES ('5f9680ce-35fb-4cb7-96f7-84e3725127fe', 'Reference Code', 'text', 'ref_code', 20);
    `);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
          DELETE from default_attributes
          WHERE id = '5f9680ce-35fb-4cb7-96f7-84e3725127fe';
    `);
    }
};

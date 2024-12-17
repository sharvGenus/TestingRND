"use strict";

const { ALL_MASTERS_LIST } = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`UPDATE ${ALL_MASTERS_LIST}
            SET is_master = 'false'
            WHERE id IN (
                  'b089b646-c065-4151-8ca3-814c6fc89d04', '6a53b2c5-50b7-41c9-9bdb-ad35b7eee583', '5701fcdf-f467-459d-b558-329197750320', 'aaefd033-b64d-4e5b-b351-bc572e48c598', '0d84766a-71d2-4915-9eee-a44615b6c291', 'd4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7', '85f62a22-57e2-4443-bdaa-800ddf95d460', '63dfdba2-8bbc-40ea-a934-f38e44d0d2ca', '02cc1fdc-0c8b-4cf9-9977-34fed65601e7', 'c8b1bd5c-796d-4146-b318-23541d6d2e52', 'bd21c7a2-c96c-4e00-acdc-d993235ddc07'
            );`);
        
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};

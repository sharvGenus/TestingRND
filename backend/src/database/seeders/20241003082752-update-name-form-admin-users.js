"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */
        return Promise.all([
            queryInterface.sequelize.query("UPDATE USERS SET NAME = 'Admin' WHERE ID = '577b8900-b333-42d0-b7fb-347abc3f0b5c'"),
            queryInterface.sequelize.query("UPDATE USERS SET NAME = 'Inventory Admin' WHERE ID = '57436bed-c176-4625-96af-aaeec88cdc90'")
        ]);
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

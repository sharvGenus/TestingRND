"use strict";

const { ALL_MASTERS_LIST } = require("../../config/database-schema");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkUpdate(
            ALL_MASTERS_LIST,
            { visible_name: "Configure Ticket" },
            { id: "d1bc3a9e-a12b-4863-b922-b3f10c7077c9" }
        );

        await queryInterface.bulkUpdate(
            ALL_MASTERS_LIST,
            { visible_name: "Create Ticket" },
            { id: "d1bc3a9e-a12b-4863-b922-b3f10c5055c7" }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkUpdate(
            ALL_MASTERS_LIST,
            { visible_name: "Configure Ticket" },
            { id: "d1bc3a9e-a12b-4863-b922-b3f10c7077c9" }
        );

        await queryInterface.bulkUpdate(
            ALL_MASTERS_LIST,
            { visible_name: "Create Ticket" },
            { id: "d1bc3a9e-a12b-4863-b922-b3f10c5055c7" }
        );
    },
};

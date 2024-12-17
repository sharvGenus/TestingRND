"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
            ALTER TABLE form_wise_ticket_mappings ALTER COLUMN geo_location_field DROP NOT NULL;
            ALTER TABLE form_wise_ticket_mappings_history ALTER COLUMN geo_location_field DROP NOT NULL;
          `);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
            ALTER TABLE form_wise_ticket_mappings ALTER COLUMN geo_location_field SET NOT NULL;
            ALTER TABLE form_wise_ticket_mappings_history ALTER COLUMN geo_location_field SET NOT NULL;
          `);
    }
};

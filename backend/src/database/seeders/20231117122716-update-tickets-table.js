"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
    UPDATE tickets
    SET
        form_wise_mapping_id = subquery.fwtmid,
        project_wise_mapping_id = subquery.pwtmid
    FROM (
        SELECT
            project_wise_ticket_mappings.id AS pwtmid,
            form_wise_ticket_mappings.id AS fwtmid
        FROM
            tickets AS t
        INNER JOIN project_wise_ticket_mappings ON project_wise_ticket_mappings.project_id = t.project_id
        INNER JOIN form_wise_ticket_mappings ON form_wise_ticket_mappings.form_id = t.form_id
    ) AS subquery
    `);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`UPDATE tickets
        SET
            form_wise_mapping_id = NULL,
            project_wise_mapping_id = NULL`);
    }
};

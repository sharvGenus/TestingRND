"use strict";

const { USERS } = require("../../config/database-schema");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`WITH
                CTE AS (
                    SELECT
                        ID,
                        ROW_NUMBER() OVER (
                            ORDER BY
                                "created_at" ASC
                        ) + 11110 AS FN
                    FROM
                        ${USERS}
                )
            UPDATE ${USERS}
            SET
                WFM_CODE = CTE.FN
            FROM
                CTE
            WHERE
                ${USERS}.ID = CTE.ID; `);

    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkUpdate("users", { wfm_code: null });
    }
};
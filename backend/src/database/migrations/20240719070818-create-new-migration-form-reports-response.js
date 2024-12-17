'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
        DROP FUNCTION IF EXISTS EXTRACT_SIM_VALUES (TEXT);

        CREATE
        OR REPLACE FUNCTION EXTRACT_SIM_VALUES (INPUT_STRING TEXT) RETURNS TABLE (
			"SIM Slot-1" TEXT,
			"RSRP-1" TEXT,
			"RSRQ-1" TEXT,
			"SINR-1" TEXT,
			"ASU-1" TEXT,
			"Telecom Provider-1" TEXT,
			"SIM Slot-2" TEXT,
			"RSRP-2" TEXT,
			"RSRQ-2" TEXT,
			"SINR-2" TEXT,
			"ASU-2" TEXT,
			"Telecom Provider-2" TEXT
        ) AS $$
        DECLARE
		HAS_START_SIM1 BOOLEAN := INPUT_STRING ILIKE 'SIM1%';
        BEGIN
            INPUT_STRING := REPLACE(REPLACE(REPLACE(INPUT_STRING, 'null', ''), ':', ','), ';', ',');

            RETURN QUERY
            SELECT
            CASE WHEN HAS_START_SIM1 IS TRUE THEN
				split_part(fv, ',', 1) ELSE
				split_part(fv, ',', 12)
            END AS "SIM Slot-1",
            CASE WHEN HAS_START_SIM1 IS TRUE THEN
				split_part(fv, ',', 3) ELSE
				split_part(fv, ',', 14)
            END AS "RSRP-1",
            CASE WHEN HAS_START_SIM1 IS TRUE THEN
				split_part(fv, ',', 5) ELSE
				split_part(fv, ',', 16)
            END AS "RSRQ-1",
            CASE WHEN HAS_START_SIM1 IS TRUE THEN
				split_part(fv, ',', 7) ELSE
				split_part(fv, ',', 18)
            END AS "SINR-1",
            CASE WHEN HAS_START_SIM1 IS TRUE THEN
				split_part(fv, ',', 9) ELSE
				split_part(fv, ',', 20)
            END AS "ASU-1",
            CASE WHEN HAS_START_SIM1 IS TRUE THEN
				split_part(fv, ',', 10) ELSE
				split_part(fv, ',', 21)
            END AS "Telecom Provider-1",
                CASE WHEN HAS_START_SIM1 IS TRUE THEN
				split_part(fv, ',', 12) ELSE
				split_part(fv, ',', 1)
            END AS "SIM Slot-2",
            CASE WHEN HAS_START_SIM1 IS TRUE THEN
				split_part(fv, ',', 14) ELSE
				split_part(fv, ',', 3)
            END AS "RSRP-2",
            CASE WHEN HAS_START_SIM1 IS TRUE THEN
				split_part(fv, ',', 16) ELSE
				split_part(fv, ',', 5)
            END AS "RSRQ-2",
            CASE WHEN HAS_START_SIM1 IS TRUE THEN
				split_part(fv, ',', 18) ELSE
				split_part(fv, ',', 7)
            END AS "SINR-2",
            CASE WHEN HAS_START_SIM1 IS TRUE THEN
				split_part(fv, ',', 20) ELSE
				split_part(fv, ',', 9)
            END AS "ASU-2",
            CASE WHEN HAS_START_SIM1 IS TRUE THEN
				split_part(fv, ',', 21) ELSE
				split_part(fv, ',', 10)
            END AS "Telecom Provider-2"
            FROM (VALUES(INPUT_STRING)) AS v(fv);
        END;
        $$ LANGUAGE PLPGSQL;
    `);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
	await queryInterface.sequelize.query(`
        DROP FUNCTION IF EXISTS EXTRACT_SIM_VALUES (TEXT);
	`);
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};

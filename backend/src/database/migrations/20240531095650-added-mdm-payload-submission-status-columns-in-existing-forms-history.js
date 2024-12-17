"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
			DO $$
			DECLARE
				P_TABLE_NAME TEXT;
			BEGIN 
				FOR P_TABLE_NAME IN (
					SELECT
						FORMS.TABLE_NAME::TEXT
					FROM
						FORMS
					INNER JOIN INFORMATION_SCHEMA.TABLES IST ON FORMS.TABLE_NAME || '_history' = IST.TABLE_NAME
					WHERE
						FORMS.TABLE_NAME IS NOT NULL
						AND NOT EXISTS (
							SELECT
								1
							FROM
								INFORMATION_SCHEMA.COLUMNS ISC
							WHERE
								FORMS.TABLE_NAME || '_history' = ISC.TABLE_NAME
								AND ISC.COLUMN_NAME ILIKE 'mdm_payload_%'
						)
				) LOOP
					EXECUTE FORMAT(
						'ALTER TABLE %I ADD COLUMN IF NOT EXISTS mdm_payload_status TEXT',
						P_TABLE_NAME || '_history'
					);
					
					EXECUTE FORMAT(
						'ALTER TABLE %I ADD COLUMN IF NOT EXISTS mdm_payload_title TEXT',
						P_TABLE_NAME || '_history'
					);
					
					EXECUTE FORMAT(
						'ALTER TABLE %I ADD COLUMN IF NOT EXISTS mdm_payload_message TEXT',
						P_TABLE_NAME || '_history'
					);
					
					EXECUTE FORMAT(
						'ALTER TABLE %I ADD COLUMN IF NOT EXISTS mdm_payload_timestamp TIMESTAMP WITH TIME ZONE',
						P_TABLE_NAME || '_history'
					);
				END LOOP;
			END;
			$$
		`);
    },

    async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    }
};

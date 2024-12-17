"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
			-- 1. Add default value column in default attribute
			ALTER TABLE DEFAULT_ATTRIBUTES
			ADD COLUMN IF NOT EXISTS DEFAULT_VALUE TEXT;
			
			-- 2. Add default value column in default attribute history
			ALTER TABLE DEFAULT_ATTRIBUTES_HISTORY
			ADD COLUMN IF NOT EXISTS DEFAULT_VALUE TEXT;
			
			-- 3. Create a function for generate unique key
			CREATE
			OR REPLACE FUNCTION GENERATE_UNIQUE_KEY () RETURNS TEXT AS $$
			DECLARE
				v_key TEXT;
			BEGIN
				-- Generate a random string using md5 and substring to get a 10-character alphanumeric string
				v_key := substring(md5(random()::text || clock_timestamp()::text)::text from 1 for 10);
			
				RETURN v_key;
			END;
			$$ LANGUAGE PLPGSQL;
			
			-- 4. Update value of reference code column and set default value
			UPDATE DEFAULT_ATTRIBUTES
			SET
				DEFAULT_VALUE = 'generate_unique_key()'
			WHERE
				ID = '5f9680ce-35fb-4cb7-96f7-84e3725127fe';
			
			-- 5. Create a procedure to set default value of any form response
			CREATE
			OR REPLACE PROCEDURE SET_DEFAULT_VALUE_TO_ANY_FORM_RESPONSE (DEFAULT_ATTRIBUTE UUID) LANGUAGE PLPGSQL AS $$
			DECLARE
				FORM_RECORD RECORD;
				FORM_ATTR_RECORD RECORD;
			BEGIN
				-- Loop over all forms which have non-null table_name and default_attribute named 'reference'
				FOR FORM_RECORD IN
				SELECT
					F.ID,
					F.TABLE_NAME,
					FA.COLUMN_NAME,
					DA.DEFAULT_VALUE
				FROM
					FORMS F
					JOIN FORM_ATTRIBUTES FA ON F.ID = FA.FORM_ID
					JOIN DEFAULT_ATTRIBUTES DA ON FA.DEFAULT_ATTRIBUTE_ID = DA.ID
				WHERE
					DA.ID = DEFAULT_ATTRIBUTE
					AND F.TABLE_NAME IS NOT NULL 
				LOOP
					EXECUTE FORMAT('UPDATE %I SET %I = %s WHERE %I IS NULL', FORM_RECORD.TABLE_NAME, FORM_RECORD.COLUMN_NAME, FORM_RECORD.DEFAULT_VALUE, FORM_RECORD.COLUMN_NAME);
				END LOOP;
			END;
			$$;
			
			-- CALLING THE PROCEDURE TO SET DEFAULT VALUE
			CALL SET_DEFAULT_VALUE_TO_ANY_FORM_RESPONSE ('5f9680ce-35fb-4cb7-96f7-84e3725127fe');
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

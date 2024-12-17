"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
			DO $$
			DECLARE
				row record;
			query text;
			BEGIN

				IF NOT EXISTS (
					SELECT 1
					FROM pg_type
					WHERE typname = 'form_responses_is_active'
				) THEN
					CREATE TYPE form_responses_is_active AS ENUM ('3', '1', '0');
				END IF;

				FOR row IN 
					SELECT isc.table_name, isc.column_name 
					FROM information_schema.columns AS isc
					WHERE isc.udt_name='form_response_is_active'
					GROUP BY isc.table_name, isc.column_name
				LOOP
			-- 		Temporary disable the triggers
				query := 'ALTER TABLE ' || row.table_name || ' DISABLE TRIGGER ALL';
				EXECUTE query;
			
			-- 		ADD TEMP is_active column to hold previos value
				query := 'ALTER TABLE ' || row.table_name || ' ADD COLUMN IF NOT EXISTS temp_is_active form_response_is_active';
				EXECUTE query;
			
			-- 		UPDATE temp_is_active column to set value same as of is_active
				query := 'UPDATE ' || row.table_name || ' SET temp_is_active = ' || row.column_name;
				EXECUTE query;
				
			-- 		Drop column is_active
				query := 'ALTER TABLE ' || row.table_name || ' DROP COLUMN IF EXISTS ' || row.column_name;
				EXECUTE query;
			
			-- 		Recreate column is_active with new data type
				query := 'ALTER TABLE ' || row.table_name || ' ADD COLUMN  IF NOT EXISTS is_active form_responses_is_active DEFAULT ''1''';
				EXECUTE query;
			
			-- 		Set old value into newly created column
				query := 'UPDATE ' || row.table_name || ' SET is_active = CASE temp_is_active WHEN ''1'' THEN ''1''::form_responses_is_active ELSE ''0''::form_responses_is_active END';
				EXECUTE query;
			
			
			-- 		Drop temporary table at last
				query := 'ALTER TABLE ' || row.table_name || ' DROP COLUMN IF EXISTS temp_is_active';
				EXECUTE query;
			
			-- 		Enable all the triggers
				query := 'ALTER TABLE ' || row.table_name || ' ENABLE TRIGGER ALL';
				EXECUTE query;
				END LOOP;
			END $$;
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

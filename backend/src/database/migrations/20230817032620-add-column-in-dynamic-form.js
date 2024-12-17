"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
			BEGIN;
			DO $$
			DECLARE
				record_row RECORD;
				query_text text;
			BEGIN
				-- Initialize the loop
				FOR record_row IN (select * from (
					select c.table_name, c.table_schema, STRING_AGG(c.column_name, ', ') AS columns_name from information_schema.columns as c 
					where c.table_name ilike 'zform_%' group by c.table_name, c.table_schema
				) as res where res.columns_name not ilike '%submission_mode%') LOOP
					query_text := FORMAT($Q$ ALTER TABLE "%I"."%I" ADD COLUMN IF NOT EXISTS "submission_mode" TEXT DEFAULT 'Online' $Q$, record_row.table_schema, record_row.table_name);
					execute query_text;
				END LOOP;
				FOR record_row IN (select * from (
					select c.table_name, c.table_schema, STRING_AGG(c.column_name, ', ') AS columns_name from information_schema.columns as c 
					where c.table_name ilike 'zform_%' group by c.table_name, c.table_schema
				) as res where res.columns_name not ilike '%submitted_at%') LOOP
					query_text := FORMAT($Q$ ALTER TABLE "%I"."%I" ADD COLUMN IF NOT EXISTS "submitted_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP $Q$, record_row.table_schema, record_row.table_name);
					execute query_text;
				END LOOP;
				-- Initialize the loop
				FOR record_row IN (select * from (
					select c.table_name, c.table_schema, STRING_AGG(c.column_name, ', ') AS columns_name from information_schema.columns as c 
					where c.table_name ilike 'zform_%' group by c.table_name, c.table_schema
				) as res where res.columns_name ilike '%submission_mode%') LOOP
					query_text := FORMAT($Q$ ALTER TABLE "%I"."%I" ADD COLUMN IF NOT EXISTS "submission_mode" TEXT  $Q$, record_row.table_schema, record_row.table_name);
					execute 'UPDATE "' || record_row.table_schema || '"."' || record_row.table_name || '" SET created_by=''577b8900-b333-42d0-b7fb-347abc3f0b5c'', updated_by=''577b8900-b333-42d0-b7fb-347abc3f0b5c'', submitted_at=created_at';
				END LOOP;
			END;
			$$;
			COMMIT;
    	`);
    },

    async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
        return queryInterface.sequelize.query(`
			BEGIN;
			DO $$
			DECLARE
				record_row RECORD;
				query_text text;
			BEGIN
				-- Initialize the loop
				FOR record_row IN (select * from (
					select c.table_name, c.table_schema, STRING_AGG(c.column_name, ', ') AS columns_name from information_schema.columns as c 
					where c.table_name ilike 'zform_%' group by c.table_name, c.table_schema
				) as res where res.columns_name ilike '%submission_mode%') LOOP
					query_text := FORMAT($Q$ ALTER TABLE "%I"."%I" DROP COLUMN IF EXISTS "submission_mode"  $Q$, record_row.table_schema, record_row.table_name);
					execute query_text;
				END LOOP;
			END;
			$$;
			COMMIT;
		`);
    }
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
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
			) as res where res.columns_name not ilike '%ticket_id%') LOOP
				query_text := FORMAT($Q$ ALTER TABLE "%I"."%I" ADD COLUMN IF NOT EXISTS "ticket_id" UUID $Q$, record_row.table_schema, record_row.table_name);
				execute query_text;
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
			) as res where res.columns_name not like '%ticket_id%') LOOP
				query_text := FORMAT($Q$ ALTER TABLE "%I"."%I" DROP COLUMN IF EXISTS "ticket_id" $Q$, record_row.table_schema, record_row.table_name);
				execute query_text;
			END LOOP;
			END;
			$$;
			COMMIT;
    	`);
    }
};

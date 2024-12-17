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
			) as res where res.columns_name not ilike '%source%') LOOP
				query_text := FORMAT($Q$ ALTER TABLE "%I"."%I" ADD COLUMN source CHARACTER VARYING DEFAULT 'mobile'; $Q$, record_row.table_schema, record_row.table_name);
				execute query_text;
			END LOOP;
			FOR record_row IN (select * from (
				select c.table_name, c.table_schema, STRING_AGG(c.column_name, ', ') AS columns_name from information_schema.columns as c 
				where c.table_name ilike 'zform_%' group by c.table_name, c.table_schema
			) as res where res.columns_name not ilike '%counter%') LOOP
				query_text := FORMAT($Q$ ALTER TABLE "%I"."%I" ADD COLUMN counter INTEGER DEFAULT 1 $Q$, record_row.table_schema, record_row.table_name);
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
			) as res where res.columns_name like '%source%') LOOP
				query_text := FORMAT($Q$ ALTER TABLE "%I"."%I" DROP COLUMN IF EXISTS "source" $Q$, record_row.table_schema, record_row.table_name);
				execute query_text;
			END LOOP;
			FOR record_row IN (select * from (
				select c.table_name, c.table_schema, STRING_AGG(c.column_name, ', ') AS columns_name from information_schema.columns as c 
				where c.table_name ilike 'zform_%' group by c.table_name, c.table_schema
			) as res where res.columns_name like '%counter%') LOOP
				query_text := FORMAT($Q$ ALTER TABLE "%I"."%I" DROP COLUMN IF EXISTS "counter" $Q$, record_row.table_schema, record_row.table_name);
				execute query_text;
			END LOOP;
			END;
			$$;
			COMMIT;
    	`);
    }
};

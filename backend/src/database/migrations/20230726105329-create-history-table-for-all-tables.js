"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
			-- ==================== Create a PL/pgSQL function to update the 'is_active' column in all tables that have it ======================
			CREATE OR REPLACE PROCEDURE add_deleted_at_column()
			AS $$
			DECLARE
				p_table_name text;
			BEGIN
			FOR p_table_name IN
				SELECT r.table_name FROM (
					SELECT ic.table_name, pt.tgname FROM information_schema.tables AS it
					INNER JOIN information_schema.columns AS ic
					ON ic.table_name = it.table_name AND ic.column_name = 'is_active' AND it.table_name not ilike '%_history%'
					LEFT OUTER JOIN pg_trigger AS pt ON
					pt.tgname ilike '%' || it.table_name || '%'
				) AS r
				WHERE r.tgname is null
				GROUP BY r.table_name
			LOOP
				CALL create_history_table('public', p_table_name);
			END LOOP;
			END;
			$$ LANGUAGE plpgsql;
			-- calling add delete column function for once 
			-- TODO: need to delete this line later on						
			CALL add_deleted_at_column();

			-- ==================== Create a PL/pgSQL function to delete existing triggers ======================================================
			CREATE OR REPLACE PROCEDURE delete_triggers() 
			AS $$
			DECLARE
				trigger_record RECORD;
			BEGIN
				FOR trigger_record IN
					SELECT tgname, 
					CASE when tgname LIKE '%_history_insert' THEN REPLACE(REPLACE(tgname, 'trg_', ''), '_history_insert', '')
					when tgname LIKE '%_history_update' THEN REPLACE(REPLACE(tgname, 'trg_', ''), '_history_update', '')
					when tgname LIKE '%_history_update_delete' THEN REPLACE(REPLACE(tgname, 'trg_', ''), '_history_update_delete', '') END
					as p_table_name
					FROM pg_trigger
					WHERE tgname LIKE '%_history_%'
				LOOP
					EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_record.tgname || ' ON ' || trigger_record.p_table_name;
				END LOOP;
			END;
			$$
			LANGUAGE plpgsql;

			-- ==================== Create a PL/pgSQL function to delete existing history tables ================================================
			CREATE OR REPLACE PROCEDURE delete_history_tables() 
			AS $$
			DECLARE
				p_table_name TEXT;
			BEGIN
				FOR p_table_name IN
					SELECT table_name
					FROM information_schema.tables
					WHERE table_schema = 'public'
					AND table_name LIKE '%_history'
				LOOP
					EXECUTE 'DROP TABLE ' || p_table_name;
				END LOOP;
			END;
			$$
			LANGUAGE plpgsql;
        `);
    },

    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`
          DROP PROCEDURE IF EXISTS add_deleted_at_column;
        `);
    }
};

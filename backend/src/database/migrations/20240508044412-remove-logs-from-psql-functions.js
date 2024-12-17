"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`-- ============================ Procedure to check the association for any table before deleting any record =============================
			CREATE OR REPLACE FUNCTION check_for_associations(
			self_schema_name text,
			self_table_name text,
			record_id uuid
			) RETURNS text
			LANGUAGE plpgsql
			AS $BODY$
			DECLARE
				tables_with_joins refcursor;
				tables_with_join record;
				query_result integer;
				query_text text;
				message text := '';
			BEGIN
				query_text := FORMAT(
				$QUERY$
					SELECT conname AS constraint_name,
						conrelid::regclass AS table_name,
						a.attname AS column_name,
						ns.nspname AS schema_name,
						confrelid::regclass AS referenced_table_name,
						af.attname AS referenced_column_name
					FROM pg_constraint
					JOIN pg_attribute AS a ON a.attnum = ANY(conkey) AND a.attrelid = conrelid
					JOIN pg_attribute AS af ON af.attnum = ANY(confkey) AND af.attrelid = confrelid
					JOIN pg_class AS c ON c.oid = conrelid
					JOIN pg_namespace AS ns ON ns.oid = c.relnamespace
					WHERE confrelid = %L::regclass;
				$QUERY$, self_table_name, self_table_name
				);
		
				OPEN tables_with_joins FOR EXECUTE query_text;
		
				FETCH NEXT FROM tables_with_joins INTO tables_with_join;
				WHILE FOUND LOOP
				query_text := FORMAT($QUERY$
					SELECT count(column_name) FROM information_schema.columns 
					WHERE table_schema = %L AND table_name = %L AND column_name = 'is_active';
				$QUERY$, self_schema_name, tables_with_join.table_name);
		
				EXECUTE query_text INTO query_result;
		
				IF query_result > 0 THEN
					query_text := FORMAT($QUERY$ 
						SELECT count(%I) FROM %I.%I WHERE %I = %L AND is_active = '1'
					$QUERY$, tables_with_join.column_name, tables_with_join.schema_name, tables_with_join.table_name, tables_with_join.column_name, record_id);
		
					EXECUTE query_text INTO query_result;
		
					IF query_result > 0 THEN
						message := FORMAT('Can not delete, as it has dependent child in %I.%I!', tables_with_join.schema_name, tables_with_join.table_name);
						EXIT; -- Break the loop
					END IF;

				END IF;
		
				FETCH NEXT FROM tables_with_joins INTO tables_with_join;
				END LOOP;
		
				CLOSE tables_with_joins;
				RETURN message;
			END;
			$BODY$;

			-- ======================================== Trigger function for update records as soft delete ========================================
			CREATE OR REPLACE FUNCTION soft_delete_rows() RETURNS trigger LANGUAGE 'plpgsql'
			AS $BODY$
			DECLARE
				schema_name text := TG_ARGV[0];
				table_name text := TG_ARGV[1];
				history_table_name text := TG_ARGV[1] || '_history';
				column_names text;
				query_to_execute TEXT;
			BEGIN
				IF row_to_json(NEW)::jsonb ? 'is_active' THEN

					IF NEW.is_active <> OLD.is_active THEN
						IF  NEW.is_active::text = '0' THEN
							IF row_to_json(NEW)::jsonb ? 'deleted_at' THEN
								NEW.deleted_at = now();
							END IF;
						ELSE
							IF row_to_json(NEW)::jsonb ? 'deleted_at' THEN
								NEW.deleted_at = null;
							END IF;
						END IF;
					END IF;
				END IF;
				RETURN NEW;
				END;
			$BODY$;
      `);
    },

    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`
          DROP FUNCTION IF EXISTS check_for_associations;
          DROP FUNCTION IF EXISTS soft_delete_rows;
        `);
    }
};

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
			-- ======================================================== Enable UUID extension =======================================================
			CREATE EXTENSION IF NOT EXISTS "uuid-ossp";	

			-- ============================ Procedure to check the association for any table before deleting any record =============================
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
		
					RAISE NOTICE 'Number of dependent records %', query_result;
				END IF;
		
				FETCH NEXT FROM tables_with_joins INTO tables_with_join;
				END LOOP;
		
				CLOSE tables_with_joins;
				RETURN message;
			END;
			$BODY$;

			-- =========================================== Function to create triggers for history tables ===========================================
			CREATE OR REPLACE PROCEDURE create_history_triggers(
				schema_name text,
				table_name text
			)
			LANGUAGE 'plpgsql'
			AS $BODY$
			DECLARE
				i_trigger_name text;
				u_trigger_name text;
				ud_trigger_name text;
			BEGIN
				-- Generate a unique trigger name based on the table name
				i_trigger_name := 'trg_' || table_name || '_history_insert';
				u_trigger_name := 'trg_' || table_name || '_history_update';
				ud_trigger_name := 'trg_' || table_name || '_history_update_delete';
				-- Create the insert trigger
				IF NOT EXISTS (
					SELECT 1
					FROM pg_trigger
					WHERE tgname = i_trigger_name
				) THEN
					EXECUTE '
						CREATE TRIGGER ' || i_trigger_name || '
						AFTER INSERT ON ' || schema_name || '.' || table_name || '
						FOR EACH ROW
						EXECUTE FUNCTION insert_history_function('|| schema_name ||', '|| table_name ||');';
				END IF;
				IF NOT EXISTS (
					SELECT 1
					FROM pg_trigger
					WHERE tgname = u_trigger_name
				) THEN
					EXECUTE '
						CREATE TRIGGER ' || u_trigger_name || '
						AFTER UPDATE ON ' || schema_name || '.' || table_name || '
						FOR EACH ROW
						EXECUTE FUNCTION insert_history_function('|| schema_name ||', '|| table_name ||');';
				END IF;
				IF NOT EXISTS (
					SELECT 1
					FROM pg_trigger
					WHERE tgname = ud_trigger_name
				) THEN
					EXECUTE '
						CREATE TRIGGER ' || ud_trigger_name || '
						BEFORE UPDATE ON ' || schema_name || '.' || table_name || '
						FOR EACH ROW
						EXECUTE FUNCTION soft_delete_rows('|| schema_name ||', '|| table_name ||');';
				END IF;
			END;
			$BODY$;

			-- ========================================= Function  to create history tables for all tables ==========================================
			DROP FUNCTION IF EXISTS create_history_table;
			CREATE OR REPLACE PROCEDURE create_history_table(
				schema_name text,
				table_name text
			)
			LANGUAGE 'plpgsql'
			AS $$
			DECLARE
				history_table_name text;
				column_definition text;
				primary_key text;
			BEGIN
				-- Generate history table name by appending "_history" to the original table name
					history_table_name := table_name || '_history';
					primary_key := history_table_name || '_pkey';
				-- Generate column definitions for the history table
				EXECUTE format($query$
					SELECT STRING_AGG(concat('"'|| column_name || '"', ' ',
						case data_type when 'USER-DEFINED' then udt_name else 
							case data_type when 'ARRAY' then REPLACE(udt_name, '_', '') || '[]' else data_type end
						end,			
						case when character_maximum_length is not null then concat('(',character_maximum_length, ')') end
					), ', ') 
					as col
						FROM information_schema.columns WHERE table_schema = %L AND table_name = %L AND column_name != 'id' group by table_name $query$, schema_name, table_name)
					INTO column_definition;
				
				-- Create the history table
				EXECUTE format('
					CREATE TABLE IF NOT EXISTS %I (
						id uuid DEFAULT uuid_generate_v4() NOT NULL,
						%s,
					record_id uuid,
						CONSTRAINT %I PRIMARY KEY (id)
					)', history_table_name, column_definition, primary_key);
				
				-- Display a message indicating successful creation
				RAISE NOTICE 'History table % created successfully!', history_table_name;
				CALL create_history_triggers(schema_name, table_name);
			END;
			$$;

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
					RAISE NOTICE 'checking for not equals %, %, %', new.is_active, old.is_active, row_to_json(NEW)::jsonb ? 'is_active';
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

			-- ======================================== Trigger function for insert records in history table ========================================
			CREATE OR REPLACE FUNCTION insert_history_function() RETURNS trigger LANGUAGE 'plpgsql'
			AS $BODY$
			DECLARE
				schema_name text := TG_ARGV[0];
				table_name text := TG_ARGV[1];
				history_table_name text := TG_ARGV[1] || '_history';
				column_names text;
				query_to_execute TEXT;
			BEGIN
				EXECUTE FORMAT($new$ 
					SELECT STRING_AGG(concat('"', key, '"'), ', ') FROM json_each_text(%L) WHERE key != 'id'
				$new$, row_to_json(NEW)) INTO column_names;

				query_to_execute := FORMAT($INSERT$ INSERT INTO %I.%I (%s, "record_id", "id") SELECT %s, %L AS recods_id, uuid_generate_v4() AS id FROM %I.%I WHERE id=%L
			   	$INSERT$, schema_name, history_table_name, column_names, column_names, NEW.id, schema_name, table_name, NEW.id);

				-- QUERY TO INSERT DATA IN HISTORY TABLE
				EXECUTE query_to_execute;
				RETURN NEW;
				END;
			$BODY$;
        `);
    },

    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`
          DROP EXTENSION CASCADE IF EXISTS "uuid-ossp";
          DROP FUNCTION IF EXISTS insert_history_function;
          DROP PROCEDURE IF EXISTS create_history_table;
          DROP PROCEDURE IF EXISTS create_history_triggers;
		  DROP FUNCTION IF EXISTS check_for_associations;
        `);
    }
};

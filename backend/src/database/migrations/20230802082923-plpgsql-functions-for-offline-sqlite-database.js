"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Create the procedure
        await queryInterface.sequelize.query(`
            -- ============================== Functions to fetch all tables with their columns and their datatype ===================
            DROP FUNCTION IF EXISTS fetch_table_with_columns_data_type(text);
            CREATE OR REPLACE FUNCTION fetch_table_with_columns_data_type (p_schema text)
            RETURNS TABLE (table_name text, columns text)
            LANGUAGE plpgsql
            AS $$
            DECLARE
                query_text text;
            BEGIN
                query_text:= FORMAT($query$
                    SELECT res.table_name as "table_name", CONCAT('CREATE TABLE IF NOT EXISTS "', res.table_name, '" (', res.columns, ')') AS "columns" FROM (
						SELECT table_name::text, STRING_AGG(
                        concat(
                            '"' || column_name || '" ',
                            CASE WHEN data_type = 'ARRAY' THEN REPLACE(udt_name::text, '_', '') || '[]' END,
                            CASE WHEN data_type = 'USER-DEFINED' AND udt_name::text ILIKE '%%_is_active%%' THEN 'text' END,
                            CASE WHEN data_type = 'USER-DEFINED' AND udt_name::text NOT ILIKE '%%_is_active%%' THEN udt_name::text END,
                            CASE WHEN data_type <> 'USER-DEFINED' AND udt_name::text NOT ILIKE '%%_is_active%%' AND data_type <> 'ARRAY' THEN data_type END,
                            CASE WHEN character_maximum_length IS NOT NULL THEN concat('(', character_maximum_length, ')') END
                        ), ', ')::text AS columns
        	            FROM information_schema.columns
    	                WHERE table_schema = %L
                            AND table_name NOT IN ('system_migrations', 'system_seeders')
                            AND table_name NOT LIKE '%%_history'
	                    GROUP BY table_name
					) AS res
                $query$, p_schema);

                RETURN QUERY EXECUTE query_text;
            END;
            $$;

            
            -- ============================== Function of fetch all records for insert records ======================================
            DROP FUNCTION IF EXISTS get_row_data;
			CREATE OR REPLACE FUNCTION get_row_data(text, text, text) RETURNS text
            LANGUAGE 'plpgsql'
            AS $$
            DECLARE
                p_schema text := $1;
                p_table text := $2;
            p_condtion text := $3;
                query_text text;
                all_columns record;
            result_text text;
                is_tabl_exists int;
            BEGIN
            -- check if table exists;
            EXECUTE FORMAT($F$
              select count(*) from information_schema.tables WHERE table_schema = %L AND table_name = %L
              $F$, p_schema, p_table) INTO is_tabl_exists;
            
            IF is_tabl_exists > 0 THEN
              -- get all columns of a table
              query_text := FORMAT($F$
                SELECT '"' || STRING_AGG(column_name, '", "') || '"' as columns,
					STRING_AGG('CASE WHEN "'|| column_name || '" IS NOT null then '''''''' || 
						REPLACE("res"."' || column_name ||
						'"::text, '''''''', '''''''''''') || '''''', '' ELSE ''null, '' END', ' || '
					) AS column_ref from information_schema.columns
                WHERE table_schema=%L AND table_name = %L
              $F$, p_schema, p_table);
              EXECUTE query_text INTO all_columns;

              query_text := FORMAT($F$
                  SELECT REPLACE(STRING_AGG('(' || %s || ')', ', '), ', )', ' )') FROM (
                    SELECT * FROM %s %s
                  ) AS res
              $F$, all_columns.column_ref, p_table, p_condtion);

              EXECUTE query_text INTO result_text;
              result_text := 'INSERT INTO "' || p_table || '" (' || all_columns.columns || ') VALUES ' || result_text;
            ELSE
              result_text := '';
            END IF;
            RETURN result_text;
                END
            $$;

			-- ============================== Function of fetch all records for insert records for specific tables======================================
			DROP FUNCTION IF EXISTS fetch_table_with_columns_data_type(text, text);
			CREATE OR REPLACE FUNCTION fetch_table_with_columns_data_type (p_schema text, p_table text)
            RETURNS TABLE (table_name text, columns text)
            LANGUAGE plpgsql
            AS $$
            DECLARE
                query_text text;
				where_cluase text;
            BEGIN
				where_cluase := FORMAT('table_schema = %L AND table_name NOT IN (%L, %L) ',
				   	p_schema, 'system_migrations', 'system_seeders');

				IF p_table <> '' THEN
					where_cluase := FORMAT('%s AND table_name = %L', where_cluase, p_table);
				END IF;

                query_text:= FORMAT($query$
                    SELECT res.table_name as "table_name", CONCAT('CREATE TABLE IF NOT EXISTS "', res.table_name, '" (', res.columns, ')') AS "columns" FROM (
						SELECT table_name::text, STRING_AGG(
                        concat(
                            '"' || column_name || '" ',
                            CASE WHEN data_type = 'ARRAY' THEN REPLACE(udt_name::text, '_', '') || '[]' END,
                            CASE WHEN data_type = 'USER-DEFINED' AND udt_name::text ILIKE '%%_is_active%%' THEN 'text' END,
                            CASE WHEN data_type = 'USER-DEFINED' AND udt_name::text NOT ILIKE '%%_is_active%%' THEN udt_name::text END,
                            CASE WHEN data_type <> 'USER-DEFINED' AND udt_name::text NOT ILIKE '%%_is_active%%' AND data_type <> 'ARRAY' THEN data_type END,
                            CASE WHEN character_maximum_length IS NOT NULL THEN concat('(', character_maximum_length, ')') END
                        ), ', ')::text AS columns
        	            FROM information_schema.columns
    	                WHERE %s
	                    GROUP BY table_name
					) AS res
                $query$, where_cluase);

                RETURN QUERY EXECUTE query_text;
            END;
            $$;

            -- ============================== Function of fetch all records with insert query of specific tables========================================
            DROP FUNCTION IF EXISTS get_each_row_data;
            CREATE OR REPLACE FUNCTION get_each_row_data(text, text, text) RETURNS TABLE (
                tablename TEXT,
				id UUID,
                querytoexecute TEXT,
                valuestoinsert TEXT
            )
            LANGUAGE 'plpgsql'
            AS $$
            DECLARE
                p_schema text := $1;
                p_table text := $2;
                p_condtion text := $3;
                query_text text;
                all_columns record;
                result_record record;
                is_tabl_exists int;
            BEGIN
                -- get all columns of a table
                query_text := FORMAT($F$
                    SELECT '"' || STRING_AGG(column_name, '", "') || '"' as columns,
                        STRING_AGG('CASE WHEN "'|| column_name || '" IS NOT null then '''''''' || 
                            REPLACE("res"."' || column_name ||
                            '"::text, '''''''', '''''''''''') || '''''', '' ELSE ''null, '' END', ' || '
                        ) AS column_ref from information_schema.columns
                    WHERE table_schema=%L AND table_name = %L
                $F$, p_schema, p_table);
                EXECUTE query_text INTO all_columns;
            
                query_text := FORMAT($F$
                    SELECT res.id AS id, 'INSERT INTO "%I" (%s) VALUES ' AS querytoexecute, '%s' AS tablename, REPLACE('(' || %s || ')', ', )', ' )') AS valuestoinsert FROM (
                            SELECT * FROM %s %s
                        ) AS res
                    $F$, p_table, all_columns.columns, p_table, all_columns.column_ref, p_table, p_condtion);
                    
                FOR id, querytoexecute, tablename, valuestoinsert IN EXECUTE query_text
                LOOP
                    -- Return each row from the result
                    RETURN NEXT;
                END LOOP;
                END
            $$;
        `);
    },

    down: async (queryInterface, Sequelize) => {
        // Drop the procedure and functions
        await queryInterface.sequelize.query(`
            DROP FUNCTION IF EXISTS get_row_data;
			DROP FUNCTION IF EXISTS fetch_table_with_columns_data_type(text);
			DROP FUNCTION IF EXISTS fetch_table_with_columns_data_type(text, text);
        `);
    }
};

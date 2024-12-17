"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Create the procedure
        await queryInterface.sequelize.query(`
            -- ========================================== Procedure to create dynamic table =========================================
            CREATE OR REPLACE PROCEDURE create_dynamic_table(
                IN p_schema_name text,
                IN p_table_name text,
                IN p_columns text
            )
            LANGUAGE plpgsql
            AS $$
            BEGIN
                EXECUTE 'CREATE TABLE ' || p_schema_name || '.' || p_table_name || ' (' || p_columns || ')';
                CALL create_history_table(p_schema_name, p_table_name);
            END;
            $$;

            -- ============================== Procedure to insert new records in form submissions table =============================
            CREATE OR REPLACE PROCEDURE save_form_submissions (
                p_schema_name text,
                p_table_name text,
                p_columns text,
                p_values text
            )
            LANGUAGE plpgsql
            AS $$
            DECLARE
                query_text text;
            BEGIN
                query_text := FORMAT($q$
                    INSERT INTO %s.%s (%s) values (%s);
                $q$, p_schema_name, p_table_name, p_columns, p_values);
                EXECUTE query_text;
            END;
            $$;

            -- ============================== Procedure to insert new records in form submissions table =============================
            CREATE OR REPLACE PROCEDURE update_form_submissions (
                p_schema_name text,
                p_table_name text,
                update_columns_text text,
                record_id uuid
            )
            LANGUAGE plpgsql
            AS $$
            DECLARE
                query_text text;
                count_number integer;
            BEGIN
                -- check if record exists or not
                query_text := FORMAT($q$ 
                    SELECT COUNT(*) FROM %s.%s where id='%s';
                $q$, p_schema_name, p_table_name, record_id);
                EXECUTE query_text INTO count_number;
                IF count_number = 0 THEN
                    RAISE EXCEPTION 'Record not found';
                END IF;

                -- update the record
                query_text := FORMAT($q$
                    UPDATE %s.%s SET %s WHERE id='%s';
                $q$, p_schema_name, p_table_name, update_columns_text, record_id);
                EXECUTE query_text;
            END;
            $$;


            -- ============================== Function to get the dynamic table data ================================================
            CREATE OR REPLACE FUNCTION public.gen_query(
                p_table_schema text,
                p_table_name text,
                p_where_conditions text[],
                pagination_params text
            ) RETURNS text LANGUAGE 'plpgsql' COST 100 VOLATILE PARALLEL UNSAFE AS $BODY$
            DECLARE
                ref_records refcursor;
                record_text record;
                query_text text;
                join_query text := '';
                select_column_query text;
                select_query_result text;
                relations_alias text;
                where_condition_query text := '';
                source_table_name text;
                source_column_name text;
                source_column_namee text;
                source_column_id text; -- New variable for the source column ID
                source_table_id text;  -- New variable for the source table ID
                all_master_name text;
                all_master_table_type text;
                source_columns_cursor CURSOR FOR  -- Declare cursor to hold the source_column_rows
                        SELECT column_name,
                		form_attributes.properties ->> 'sourceColumn' AS source_column_id,
                		form_attributes.properties ->> 'sourceTable' AS source_table_id,
            			aml.table_type as all_master_table_type,
            			aml.name as all_master_name
            			FROM
                			form_attributes
                			INNER JOIN forms ON form_attributes.form_id = forms.id
            				LEFT JOIN all_masters_list AS aml ON form_attributes.properties ->> 'sourceTable' IS NOT NULL
                				AND form_attributes.properties ->> 'sourceTable' <> ''
                				AND aml.id :: text = form_attributes.properties ->> 'sourceTable'
            			WHERE
                			CASE
                    			WHEN p_table_name LIKE '%_history' THEN REPLACE(p_table_name, '_history', '')
                    			ELSE p_table_name
                				END = forms.table_name
                			AND form_attributes.properties ->> 'sourceColumn' IS NOT NULL
                			AND form_attributes.properties ->> 'sourceColumn' <> ''
                			AND form_attributes.properties ->> 'sourceTable' IS NOT NULL
                			AND form_attributes.properties ->> 'sourceTable' <> '';
            BEGIN
                select_column_query := (
                    SELECT string_agg('"' || quote_ident(p_table_name) || '"."' || quote_ident(column_name) || '"', ', ')
                    FROM information_schema.columns
                    WHERE table_name = p_table_name AND table_schema = p_table_schema
                );
                
                -- Add LEFT OUTER JOINs here
                join_query := FORMAT($Q$ 
                    LEFT OUTER JOIN users AS "user_created_by" ON user_created_by.id = %I.created_by
                    LEFT OUTER JOIN users AS "user_updated_by" ON user_updated_by.id = %I.updated_by
                $Q$, p_table_name, p_table_name);
                
                IF array_length(p_where_conditions, 1) IS NOT NULL AND array_length(p_where_conditions, 1) > 0 THEN
                    FOR i IN 1..array_length(p_where_conditions, 1) / 2 LOOP
                        where_condition_query := where_condition_query || format('WHERE %s = %L',
                            p_where_conditions[i * 2 - 1], p_where_conditions[i * 2]);
                    END LOOP;
                END IF;
                
                -- Fetch user's name from the users table
                select_column_query := select_column_query || ', "user_created_by".name AS user_created_by_name, "user_updated_by".name AS user_updated_by_name';
                
                -- Loop through the cursor to get each row from the query result
            OPEN source_columns_cursor;
            LOOP
                FETCH NEXT FROM source_columns_cursor INTO source_column_namee, source_column_id, source_table_id, all_master_table_type, all_master_name;
                EXIT WHEN NOT FOUND;
                
                -- Fetch the name of the sourceColumn using the ID from all_master_columns table
                SELECT name INTO source_column_name
                FROM all_master_columns
                WHERE id = source_column_id::uuid;
                
                -- Fetch the name of the sourceTable using the ID from all_master_lists table
                SELECT name INTO source_table_name
                FROM all_masters_list
                WHERE id = source_table_id::uuid;
                
                -- Add the subquery to the SELECT statement for each loop iteration
                IF all_master_table_type = 'table' THEN
                    -- Add the subquery for "table" type using || to concatenate columns
                     select_column_query := select_column_query || format(
                                ', (
                                    SELECT jsonb_agg(%I.%I) 
                                    FROM %I 
                                    WHERE %I.id = ANY(%I.%I)
                                ) AS %s_data',
                                source_table_name, source_column_name, source_table_name, source_table_name, p_table_name, source_column_namee, source_column_namee
                            );
            	ELSIF all_master_name = 'serial_numbers' THEN
                    -- Add the subquery for "serial_numbers" case using || to concatenate columns
                    select_column_query := select_column_query || format(
                        ', (SELECT jsonb_agg(' || source_column_name || ') FROM "material_serial_numbers" sn INNER JOIN "stock_ledgers" sl ON sn.stock_ledger_id = sl.id WHERE sn.id = ANY(%I.%I)) AS %s_data',
                        p_table_name, source_column_namee,source_column_namee
                );
            	ELSIF all_master_name = 'nonserialize_materials' THEN
                    -- Add the subquery for "serial_numbers" case using || to concatenate columns
                    select_column_query := select_column_query || format(
                        ', (SELECT jsonb_agg(distinct(' || source_column_name || ')) AS name FROM stock_ledgers sl INNER JOIN materials m ON sl.material_id = m.id WHERE m.id = ANY(%I.%I)) AS %s_data',
                        p_table_name, source_column_namee,source_column_namee
                );
            	End If;
            END LOOP;
            CLOSE source_columns_cursor;
                    
                -- Generate the final query
                query_text := format(
                    $a$ SELECT %s FROM %s %s %s %s $a$,
                    select_column_query,
                    p_table_name,
                    join_query,
                    CASE WHEN where_condition_query <> '' THEN  where_condition_query ELSE '' END,
                    pagination_params
                );
                
                RETURN query_text;
            END;
            $BODY$;

            -- ============================== Functions to fetch all tables with their columns and their datatype ===================
            CREATE OR REPLACE FUNCTION add_column(
                master_table_schema text,
                master_table text,
                add_column_text text,
                constraint_array text[]
            )
            RETURNS text AS
            $$
            DECLARE
                query_text text;
                constraint_text text;
                success_msg text := 'Column added successfully.';
                constraint_count integer;
            BEGIN
                query_text := 'ALTER TABLE ' || master_table_schema || '.' || master_table || ' ' || add_column_text;
                
                EXECUTE query_text;
                
                constraint_count := array_length(constraint_array, 1);
                IF constraint_count IS NOT NULL THEN
                    FOR i IN 1..constraint_count
                    LOOP
                        constraint_text := constraint_array[i];
                        EXECUTE constraint_text;
                    END LOOP;
                END IF;
                
                RETURN success_msg;
            END;
            $$
            LANGUAGE plpgsql;
        `);
    },

    down: async (queryInterface, Sequelize) => {
        // Drop the procedure and functions
        await queryInterface.sequelize.query(`
            DROP PROCEDURE IF EXISTS create_dynamic_table;
            DROP PROCEDURE IF EXISTS save_form_submissions;
            DROP PROCEDURE IF EXISTS update_form_submissions;
            DROP FUNCTION IF EXISTS gen_query;
            DROP FUNCTION IF EXISTS add_column;
        `);
    }
};

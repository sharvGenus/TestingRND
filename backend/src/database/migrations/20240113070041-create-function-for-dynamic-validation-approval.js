"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        /**
         * 1. Fuction to retrive data for approval level for dynamic forms
		 * 2. Function to get data from any tables in json format by passing the table name
		 * 3. Function to get final data for form responses in json format
		 * 4. Function to supervrisors data on daily basis
         */

        return queryInterface.sequelize.query(`
		-- 1.
		DROP FUNCTION IF EXISTS fetch_approval_status;
		CREATE OR REPLACE FUNCTION fetch_approval_status() RETURNS TABLE (
			"customer" CHARACTER VARYING(255),
			"project" CHARACTER VARYING(255),
			"form_type" CHARACTER VARYING(255),
			"form_name" CHARACTER VARYING(255),
			"date" DATE,
			"l_1_approved" BIGINT,
			"l_1_rejected" BIGINT,
			"l_1_on_hold" BIGINT,
			"l_1_approval_pending" BIGINT,
			"l_2_approved" BIGINT,
			"l_2_rejected" BIGINT,
			"l_2_on_hold" BIGINT,
			"l_2_approval_pending" BIGINT,
			"daily_count" BIGINT,
			"first_activity" TIMESTAMP WITHOUT TIME ZONE,
			"last_activity" TIMESTAMP WITHOUT TIME ZONE,
			"total_working" TEXT
		) AS $$ 
		DECLARE
			query_text text;
			table_query text;
			-- FETCH ALL AVAILABLE FORMS WITH APPROVAL LEVELS
			forms_data CURSOR FOR
				SELECT "forms".* FROM "public"."forms" 
				INNER JOIN "public"."form_attributes" AS "fa" ON "fa"."form_id" = "forms"."id"
				WHERE "fa"."column_name" = 'l_b_approval_status' AND "forms"."is_active" = '1' AND "forms"."is_published" <> false AND "forms"."table_name" IS NOT NULL;
			form record;
		BEGIN
			-- GET ALL DYNAMIC TABLES WITH THE APPROVAL LEVELS
			-- Open the cursor
			OPEN forms_data;
		
			LOOP
				FETCH forms_data INTO form;
				EXIT WHEN NOT FOUND;
				
				table_query := 'SELECT
						id, created_at, l_a_approval_status, l_b_approval_status, ''' || form.table_name || ''' as forms_table_name, is_active, created_by
					FROM
						' || form.table_name;
		
				IF query_text IS NOT NULL THEN 
					query_text := query_text || ' UNION ' || table_query;
				ELSE
					query_text := table_query;
				END IF;
			END LOOP;
		
			-- CLOSE THE CURSOR
			CLOSE forms_data;
		
			-- CREATE NEW QUERY
			query_text := 'SELECT
					"projects"."name" AS "customer",
					"projects"."code" AS "project",
					"form_types"."name" AS "form_type",
					"forms"."name" AS "form_name",
					"source"."created_at"::date AS "date",
					COUNT(CASE WHEN "l_1_approvals"."name" = ''Approved'' THEN 1 END) AS "l_1_approved",
					COUNT(CASE WHEN "l_1_approvals"."name" = ''Reject'' THEN 1 END) AS "l_1_rejected",
					COUNT(CASE WHEN "l_1_approvals"."name" = ''On-Hold'' THEN 1 END) AS "l_1_on_hold",
					COUNT(CASE WHEN "l_1_approvals"."name" IS NULL THEN 1 END) AS "l_1_approval_pending",
					COUNT(CASE WHEN "l_2_approvals"."name" = ''Approved'' THEN 1 END) AS "l_2_approved",
					COUNT(CASE WHEN "l_2_approvals"."name" = ''Reject'' THEN 1 END) AS "l_2_rejected",
					COUNT(CASE WHEN "l_2_approvals"."name" = ''On-Hold'' THEN 1 END) AS "l_2_on_hold",
					COUNT(CASE WHEN "l_2_approvals"."name" IS NULL THEN 1 END) AS "l_2_approval_pending",
					COUNT(*) AS "daily_count",
					MIN(DATE_TRUNC (''minute'', "source"."created_at"::timestamp)) AS "first_activity",
						MAX(DATE_TRUNC (''minute'', "source"."created_at"::timestamp)) AS "last_activity",
					EXTRACT(
						HOUR FROM(MAX(DATE_TRUNC (''minute'', "source"."created_at"::timestamp))
							- 
						MIN(DATE_TRUNC (''minute'', "source"."created_at"::timestamp)))
					) || '' Hours '' || EXTRACT(
						minute FROM(MAX(DATE_TRUNC (''minute'', "source"."created_at"::timestamp))
							-
						MIN(DATE_TRUNC (''minute'', "source"."created_at"::timestamp)))
					) || '' Minutes'' as "total_working"
				FROM
					(' || query_text || ') AS "source"
					FULL JOIN "public"."project_master_maker_lovs" AS "l_1_approvals" ON array_to_string("source"."l_a_approval_status", '''') = "l_1_approvals"."id"::text
					FULL JOIN "public"."project_master_maker_lovs" AS "l_2_approvals" ON array_to_string("source"."l_b_approval_status", '''') = "l_2_approvals"."id"::text
					INNER JOIN "public"."forms" ON "forms"."table_name" = "source"."forms_table_name"
					LEFT JOIN "public"."master_maker_lovs" AS "form_types" ON "form_types"."id" = "forms"."form_type_id"
					INNER JOIN "public"."projects" ON "forms"."project_id" = "projects"."id"
				WHERE
					"source".is_active = ''1''
				GROUP BY
					"projects"."name",
					"projects"."code",
					"form_types"."name",
					"forms"."name",
					"source"."created_at"::date
				ORDER BY
					"form_types"."name" DESC,
					"forms"."name" ASC,
					"source"."created_at"::date DESC';
			RETURN QUERY EXECUTE query_text;
			END;
		$$ LANGUAGE plpgsql;
		
		---------------------------------------------------------------------------------------------------------------------------------------------
		-- 2.
		DROP FUNCTION IF EXISTS get_data_in_json;

		CREATE OR REPLACE FUNCTION get_data_in_json(p_table_name text)
		RETURNS TABLE (
			table_name TEXT,
			result_row JSON
		)
		AS $$
		DECLARE
			query_text TEXT := 'SELECT  ''' || p_table_name || ''' AS table_name, row_to_json(t) AS result_row FROM "public"."' || p_table_name || '" t' ;
		BEGIN
			RETURN QUERY EXECUTE query_text;
		END;
		$$ LANGUAGE plpgsql;

		---------------------------------------------------------------------------------------------------------------------------------------------
		-- 3.
		DROP FUNCTION IF EXISTS get_response_data_for_dynamic_tables;

		CREATE OR REPLACE FUNCTION get_response_data_for_dynamic_tables(p_schema_name text, p_table_name text)
		RETURNS TABLE (table_name TEXT, result_row JSON) 
		AS $$ 
		DECLARE
			query_text TEXT;
			query_to_get_text TEXT := FORMAT(
				$Q$
				SELECT
					(
						'SELECT ' || '%I' || '.' || '"id" as "Response ID", ' || string_agg(
							CASE
								WHEN subquery.da_type = 'uuid[]' THEN 'STRING_AGG("' || subquery.aml_name || '_' || subquery.ifs_column_name || '"."' || CASE
									when subquery.factory_table IS NOT NULL THEN 'factory_value'
									ELSE subquery.am_name
								END || '"::text, '', '') AS "' || subquery.fa_name || '"'
								WHEN subquery.da_type = 'text[]' THEN 'array_to_string(' || '%I' || '."' || subquery.ifs_column_name || '", '' , '') AS "' || subquery.fa_name || '"'
								WHEN subquery.da_input_type = 'date' THEN CASE
									WHEN subquery.picket_type = 'dateOnly' THEN 'TO_CHAR((' || '%I' || '."' || subquery.ifs_column_name || '"::timestamp AT TIME ZONE ''UTC'' AT TIME ZONE ''Asia/Kolkata''), ''DD-MM-YYYY'') AS "' || subquery.fa_name || '"'
									WHEN subquery.picket_type = 'timeOnly' THEN CASE
										WHEN subquery.time_format = '12hour' THEN 'TO_CHAR((' || '%I' || '."' || subquery.ifs_column_name || '"::timestamp AT TIME ZONE ''UTC'' AT TIME ZONE ''Asia/Kolkata''), ''hh12:MI AM'') AS "' || subquery.fa_name || '"'
										ELSE 'TO_CHAR((' || '%I' || '."' || subquery.ifs_column_name || '"::timestamp AT TIME ZONE ''UTC'' AT TIME ZONE ''Asia/Kolkata''), ''HH24:MI'' ) AS "' || subquery.fa_name || '"'
									END
									WHEN subquery.picket_type = 'dateTimeBoth' THEN CASE
										WHEN subquery.time_format = '12hour' THEN 'TO_CHAR((' || '%I' || '."' || subquery.ifs_column_name || '"::timestamp AT TIME ZONE ''UTC'' AT TIME ZONE ''Asia/Kolkata''), ''DD-MM-YYYY , hh12:MI AM'') AS "' || subquery.fa_name || '"'
										ELSE 'TO_CHAR((' || '%I' || '."' || subquery.ifs_column_name || '"::timestamp AT TIME ZONE ''UTC'' AT TIME ZONE ''Asia/Kolkata''), ''DD-MM-YYYY , HH24:MI'' ) AS "' || subquery.fa_name || '"'
									END
									ELSE '' || '%I' || '."' || subquery.ifs_column_name || '" AT TIME ZONE ''UTC'' AT TIME ZONE ''Asia/Kolkata''::TEXT AS "' || subquery.fa_name || '"'
								END
								ELSE '' || '%I' || '."' || subquery.ifs_column_name || '"::TEXT AS "' || subquery.fa_name || '"'
							END,
							', '
						) || ',' || 'submission_mode::TEXT as "Submission Mode",' || 'counter::TEXT as "Counter",' || 'source::TEXT as "Source",' || 'TO_CHAR(TIMEZONE(''Asia/Kolkata'', ' || '%I' || '.' || 'created_at' || ')' || ', ''DD-MM-YYYY HH24:MI:SS'') as "Created On",' || 'TO_CHAR(TIMEZONE(''Asia/Kolkata'', ' || '%I' || '.' || 'updated_at' || ')' || ', ''DD-MM-YYYY HH24:MI:SS'') as "Updated On",' || 'TO_CHAR(TIMEZONE(''Asia/Kolkata'', submitted_at)' || ', ''DD-MM-YYYY HH24:MI:SS'') as "Submitted On",' || '"pwtm"."prefix"::TEXT ||  "tickets"."ticket_number"::TEXT AS "Ticket Number", ' || '"user_created_by".name::TEXT AS "Created By", ' || '"user_updated_by".name::TEXT AS "Updated By" FROM ' || '%I ' || string_agg(
							CASE
								WHEN subquery.da_type = 'uuid[]'
								AND subquery.aml_table_type = 'table' THEN 'LEFT OUTER JOIN ' || subquery.aml_name || ' AS ' || subquery.aml_name || '_' || subquery.ifs_column_name || ' ON ' || subquery.aml_name || '_' || subquery.ifs_column_name || '.id' || ' = ' || 'ANY(%I.' || subquery.ifs_column_name || ')'
								WHEN subquery.da_type = 'uuid[]'
								AND subquery.factory_table IS NULL
								AND subquery.aml_table_type = 'function' THEN 'LEFT OUTER JOIN ' || subquery.aml_name || '(null, null) AS ' || subquery.aml_name || '_' || subquery.ifs_column_name || ' ON ' || subquery.aml_name || '_' || subquery.ifs_column_name || '.id' || ' = ' || 'ANY(%I.' || subquery.ifs_column_name || ')'
								WHEN subquery.da_type = 'uuid[]'
								AND subquery.factory_table IS NOT NULL
								AND subquery.aml_table_type = 'function' THEN 'LEFT OUTER JOIN ' || subquery.aml_name || '(null, null, ''' || subquery.factory_table || ''', ''' || subquery.factory_column || ''', ''' || subquery.link_column || ''', ''' || subquery.source_column || ''') AS ' || subquery.aml_name || '_' || subquery.ifs_column_name || ' ON ' || subquery.aml_name || '_' || subquery.ifs_column_name || '.id' || ' = ' || 'ANY(%I.' || subquery.ifs_column_name || ')'
								ELSE ' '
							END,
							' '
						) || 'LEFT OUTER JOIN tickets ON tickets.id = ' || '%I' || '.' || 'ticket_id ' || 'LEFT OUTER JOIN project_wise_ticket_mappings AS pwtm ON pwtm.id = tickets.project_wise_mapping_id ' || 'LEFT OUTER JOIN users AS "user_created_by" ON "user_created_by".id = ' || '%I' || '.' || 'created_by ' || 'LEFT OUTER JOIN users AS "user_updated_by" ON "user_updated_by".id = ' || '%I' || '.' || 'updated_by GROUP BY "Response ID", ' || STRING_AGG(
							CASE
								WHEN subquery.da_type <> 'uuid[]' THEN '"' || subquery.fa_name || '", '
								ELSE ''
							END,
							' '
						) || ' "Submission Mode", "Ticket Number", "Source", "Counter", "Created On", "Updated On", "Submitted On", "Created By", "Updated By"'
					) as alias
				FROM
					(
						SELECT
							ifs.column_name as ifs_column_name,
							fa.rank,
							fa.name as fa_name,
							da.type as da_type,
							da.input_type as da_input_type,
							amc.name as am_name,
							aml.name as aml_name,
							fa.properties ->> 'pickerType' AS picket_type,
							fa.properties ->> 'timeFormat' AS time_format,
							aml.table_type as aml_table_type,
							forms.project_id AS forms_project_id,
							forms.updated_by AS forms_updated_by,
							CASE WHEN fa.properties ->> 'factoryTable' = '' THEN NULL ELSE fa.properties ->> 'factoryTable' END AS factory_table,
							fa.properties ->> 'factoryColumn' AS factory_column,
							fa.properties ->> 'linkColumn' AS link_column,
							fa.properties ->> 'sourceColumn' AS source_column
						FROM
							information_schema.columns AS ifs
							INNER JOIN forms ON forms.table_name = ifs.table_name
							INNER JOIN form_attributes AS fa ON LOWER(fa.column_name) = LOWER(ifs.column_name)
							AND forms.id = fa.form_id
							LEFT JOIN default_attributes AS da ON da.id = fa.default_attribute_id
							LEFT JOIN all_masters_list AS aml ON fa.properties ->> 'sourceTable' IS NOT NULL
							AND fa.properties ->> 'sourceTable' <> ''
							AND aml.id :: text = fa.properties ->> 'sourceTable'
							LEFT JOIN all_master_columns AS amc ON fa.properties ->> 'sourceColumn' IS NOT NULL
							AND fa.properties ->> 'sourceColumn' <> ''
							AND amc.id :: text = fa.properties ->> 'sourceColumn'
						WHERE
							ifs.table_name = '%I'
							AND ifs.table_schema = '%I'
							AND fa.is_active = '1'
						GROUP BY
							ifs_column_name,
							fa.rank,
							fa_name,
							da_type,
							da_input_type,
							am_name,
							aml_name,
							picket_type,
							time_format,
							aml_table_type,
							forms_project_id,
							forms_updated_by,
							factory_table,
							factory_column,
							link_column,
							source_column
						ORDER BY
							fa.rank ASC,
							fa.name ASC
					) subquery $Q$,
					p_table_name,
					p_table_name,
					p_table_name,
					p_table_name,
					p_table_name,
					p_table_name,
					p_table_name,
					p_table_name,
					p_table_name,
					p_table_name,
					p_table_name,
					p_table_name,
					p_table_name,
					p_table_name,
					p_table_name,
					p_table_name,
					p_table_name,
					p_table_name,
					p_table_name,
					p_schema_name
			);

		BEGIN
			-- execute query to generate the row query
			EXECUTE query_to_get_text INTO query_text;

			-- FORM new query to get json data from the above query
			query_text := 'SELECT ''' || p_table_name || ''' AS table_name, row_to_json(source) AS result_row FROM (' || query_text || ') AS source';
			
			-- execute the query and return the response
			RETURN QUERY EXECUTE query_text;
		END;
		$$ LANGUAGE plpgsql;

		---------------------------------------------------------------------------------------------------------------------------------------------
		-- 4.
		DROP FUNCTION IF EXISTS fetch_supervisor_status;
		CREATE OR REPLACE FUNCTION fetch_supervisor_status() RETURNS TABLE (
			"customer" CHARACTER VARYING(255),
			"project" CHARACTER VARYING(255),
			"form_type" CHARACTER VARYING(255),
			"form_name" CHARACTER VARYING(255),
			"date" DATE,
			"user" CHARACTER VARYING(255),
			"daily_count" BIGINT,
			"first_activity" TIMESTAMP WITHOUT TIME ZONE,
			"last_activity" TIMESTAMP WITHOUT TIME ZONE,
			"total_working" TEXT
		) AS $$ 
		DECLARE
			query_text text;
			table_query text;
			-- FETCH ALL AVAILABLE FORMS WITH APPROVAL LEVELS
			forms_data CURSOR FOR
				SELECT "forms".* FROM "public"."forms" 
				WHERE "forms"."is_active" = '1' AND "forms"."is_published" <> false AND "forms"."table_name" IS NOT NULL;
			form record;
		BEGIN
			-- GET ALL DYNAMIC TABLES WITH THE APPROVAL LEVELS
			-- Open the cursor
			OPEN forms_data;
		
			LOOP
				FETCH forms_data INTO form;
				EXIT WHEN NOT FOUND;
				
				table_query := 'SELECT id, created_at, ''' || 
					form.table_name || ''' as forms_table_name, is_active, created_by FROM ' || form.table_name;
		
				IF query_text IS NOT NULL THEN 
					query_text := query_text || ' UNION ' || table_query;
				ELSE
					query_text := table_query;
				END IF;
			END LOOP;
		
			-- CLOSE THE CURSOR
			CLOSE forms_data;
		
			-- CREATE NEW QUERY
			query_text := 'SELECT
					"projects"."name" AS "customer",
					"projects"."code" AS "project",
					"form_types"."name" AS "form_type",
					"forms"."name" AS "form_name",
					"source"."created_at"::date AS "date",
					"users"."name" AS "user",
					COUNT(*) AS "daily_count",
					MIN(DATE_TRUNC (''minute'', "source"."created_at"::timestamp)) AS "first_activity",
						MAX(DATE_TRUNC (''minute'', "source"."created_at"::timestamp)) AS "last_activity",
					EXTRACT(
						HOUR FROM(MAX(DATE_TRUNC (''minute'', "source"."created_at"::timestamp))
							- 
						MIN(DATE_TRUNC (''minute'', "source"."created_at"::timestamp)))
					) || '' Hours '' || EXTRACT(
						minute FROM(MAX(DATE_TRUNC (''minute'', "source"."created_at"::timestamp))
							-
						MIN(DATE_TRUNC (''minute'', "source"."created_at"::timestamp)))
					) || '' Minutes'' as "total_working"
				FROM
					(' || query_text || ') AS "source"
					INNER JOIN "public"."forms" ON "forms"."table_name" = "source"."forms_table_name"
					INNER JOIN "public"."users" ON "source"."created_by" = "users"."id"
					LEFT JOIN "public"."master_maker_lovs" AS "form_types" ON "form_types"."id" = "forms"."form_type_id"
					INNER JOIN "public"."projects" ON "forms"."project_id" = "projects"."id"
				WHERE
					"source".is_active = ''1''
				GROUP BY
					"projects"."name",
					"projects"."code",
					"form_types"."name",
					"forms"."name",
					"source"."created_at"::date,
					"users"."name"
				ORDER BY
					"form_types"."name" DESC,
					"forms"."name" ASC,
					"source"."created_at"::date DESC';
			RETURN QUERY EXECUTE query_text;
			END;
		$$ LANGUAGE plpgsql;

		`);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Delete all function
         */
        return queryInterface.sequelize.query(`
			DROP FUNCTION IF EXISTS fetch_approval_status;
			DROP FUNCTION IF EXISTS get_data_in_json;
			DROP FUNCTION IF EXISTS get_response_data_for_dynamic_tables;
		`);
    }
};

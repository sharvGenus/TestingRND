"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        DROP FUNCTION IF EXISTS dentist_united_lobsters;
        DROP FUNCTION IF EXISTS union_all_forms_for_metabase(text);
        DROP FUNCTION IF EXISTS union_all_forms_for_metabase(text, text, uuid);
        DROP FUNCTION IF EXISTS union_all_forms_for_metabase;
        DROP FUNCTION IF EXISTS header_exists_in_table;
        DROP FUNCTION IF EXISTS column_exists_in_table(text, text);
        
        CREATE OR REPLACE FUNCTION column_exists_in_table(tabl_name TEXT, col_name TEXT)
        RETURNS BOOLEAN AS $$
        DECLARE
            column_exists_in_table BOOLEAN;
        BEGIN
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.columns 
                WHERE table_name = tabl_name AND column_name = col_name
            ) INTO column_exists_in_table;

            RETURN column_exists_in_table;
        END;
        $$ LANGUAGE plpgsql;
        
        CREATE OR REPLACE FUNCTION header_exists_in_table(
            table_name TEXT,
            header_name TEXT
        )
        RETURNS TEXT AS $$
        DECLARE
            column_name TEXT;
        BEGIN
            SELECT ifs.column_name
            INTO column_name
            FROM information_schema.columns ifs
            JOIN public.form_attributes fa ON ifs.column_name = fa.column_name
            WHERE ifs.table_name = header_exists_in_table.table_name
                AND fa.name = header_exists_in_table.header_name
            LIMIT 1;

            RETURN COALESCE(column_name, '');
        END;
        $$ LANGUAGE plpgsql;

        CREATE OR REPLACE FUNCTION union_all_forms_for_metabase("mode" TEXT default 'Default', "gaaColumnName" TEXT default '', "gaaColumnValue" TEXT default NULL) RETURNS TABLE (
            "id" UUID,
            "created_at" TIMESTAMP WITH TIME ZONE,
            "Created Date" DATE,
            "l_a_approval_status" UUID,
            "l_b_approval_status" UUID,
            "material_type" UUID[],
            "circle_name" UUID[],
            "division" UUID[],
            "subdivision" UUID[],
            "region_name" UUID[],
            "zone_name" UUID[],
            "mdm_payload_status" TEXT,
            "forms_table_name" TEXT,
            "is_active" TEXT,
            "created_by" UUID,
            "form_id" UUID,
            "project_id" UUID
        ) AS $$
        DECLARE
            query_text text;
            table_query text;
            empty_uuid_array text := 'ARRAY[]::UUID[]';
            null_as_uuid text := 'NULL::UUID';
            forms_data CURSOR FOR
                SELECT DISTINCT(table_name), "forms"."id", "forms"."project_id" FROM "public"."forms"
                INNER JOIN "public"."form_attributes" AS "fa" ON "fa"."form_id" = "forms"."id"
                WHERE 
                    (
                        ("mode" = 'Default' AND "forms"."form_type_id" IN ('30ea8a65-ff5b-4bff-b1a1-892204e23669', '1d75feca-2e64-4b95-900d-fcd53446ddeb'))
                        OR ("mode" IN ('Installation', 'O&M') AND "forms"."form_type_id" = '30ea8a65-ff5b-4bff-b1a1-892204e23669')
                        OR ("mode" = 'Survey' AND "forms"."form_type_id" = '1d75feca-2e64-4b95-900d-fcd53446ddeb')
                    )
                    AND "forms"."is_active" = '1' 
                    AND "forms"."is_published" <> false
                    AND "forms"."table_name" IS NOT NULL
                    AND "forms"."name" != 'Consumer Survey for RSSI'; -- This form name needs to be ignored. Especially required for MH server. No pattern for ignore is conveyed by Genus team.
            form record;
        BEGIN
            OPEN forms_data;
        
            LOOP
                FETCH NEXT FROM forms_data INTO form;
                EXIT WHEN NOT FOUND;
        
                IF "gaaColumnName" <> '' AND "gaaColumnValue" IS NOT NULL AND NOT column_exists_in_table(form.table_name, "gaaColumnName") THEN
                    CONTINUE;
                END IF;

                IF "gaaColumnValue" = 'All' THEN
                    "gaaColumnValue" := NULL;
                END IF;
        
                IF "mode" IN ('Default', 'Survey', 'O&M') THEN
                table_query := 'SELECT
                        id,
                        created_at,
                        created_at::DATE as "Created Date",
        
                        ' || CASE WHEN column_exists_in_table(form.table_name, 'l_a_approval_status') <> false THEN 'l_a_approval_status[1]::UUID AS l_a_approval_status' ELSE null_as_uuid || ' AS l_a_approval_status' END || ',
                        ' || CASE WHEN column_exists_in_table(form.table_name, 'l_b_approval_status') <> false THEN 'l_b_approval_status[1]::UUID AS l_b_approval_status' ELSE null_as_uuid || ' AS l_b_approval_status' END || ',
                        ' || CASE WHEN header_exists_in_table(form.table_name, 'Material Type ID') <> '' THEN header_exists_in_table(form.table_name, 'Material Type ID') ELSE empty_uuid_array || ' as material_type' END || ',
                        ' || CASE WHEN column_exists_in_table(form.table_name, 'circle_name') <> false THEN 'circle_name' ELSE empty_uuid_array || ' AS circle_name' END || ',
                        ' || CASE WHEN column_exists_in_table(form.table_name, 'division_name') <> false THEN 'division_name' ELSE empty_uuid_array || ' AS division' END || ',
                        ' || CASE WHEN column_exists_in_table(form.table_name, 'subdivision_name') <> false THEN 'subdivision_name' ELSE empty_uuid_array || ' AS subdivision' END || ',
                        ' || CASE WHEN column_exists_in_table(form.table_name, 'region_name') <> false THEN 'region_name' ELSE empty_uuid_array || ' AS region_name' END || ',
                        ' || CASE WHEN column_exists_in_table(form.table_name, 'zone_name') <> false THEN 'zone_name' ELSE empty_uuid_array || ' AS zone_name' END || ',
                        ' || CASE WHEN column_exists_in_table(form.table_name, 'mdm_payload_status') <> false THEN 'mdm_payload_status' ELSE empty_uuid_array || ' AS mdm_payload_status' END || ',

                        ''' || form.table_name || ''' as forms_table_name,
                        is_active::TEXT,
                        created_by::UUID,
                        ''' || form.id || '''::UUID as form_id,
                        ''' || form.project_id || '''::UUID as project_id
                    FROM
                        ' || form.table_name || ' WHERE TRUE' || 
                        CASE 
                            WHEN "mode" = 'O&M' THEN ' AND TICKET_ID IS NOT NULL ' ELSE '' 
                        END || 
                        CASE 
                            WHEN "gaaColumnName" <> '' AND "gaaColumnValue" IS NOT NULL THEN ' AND ' || "gaaColumnName" || '[1] IN (''' || REPLACE("gaaColumnValue", ',', ''',''') || ''') ' ELSE '' 
                        END;
                ELSIF "mode" = 'Installation' THEN
                table_query := 'SELECT
                            ID,
                            created_at,
                            created_at::DATE as "Created Date",
                            ' || CASE WHEN column_exists_in_table(form.table_name, 'l_a_approval_status') <> false THEN 'l_a_approval_status[1]::UUID AS l_a_approval_status' ELSE null_as_uuid || ' AS l_a_approval_status' END || ',
                            ' || CASE WHEN column_exists_in_table(form.table_name, 'l_b_approval_status') <> false THEN 'l_b_approval_status[1]::UUID AS l_b_approval_status' ELSE null_as_uuid || ' AS l_b_approval_status' END || ',
                            ' || CASE WHEN header_exists_in_table(form.table_name, 'Material Type ID') <> '' THEN header_exists_in_table(form.table_name, 'Material Type ID') ELSE empty_uuid_array || ' as material_type' END || ',
                            ' || CASE WHEN column_exists_in_table(form.table_name, 'circle_name') THEN 'circle_name' ELSE empty_uuid_array || ' AS circle_name' END || ',
                            ' || CASE WHEN column_exists_in_table(form.table_name, 'division_name') THEN 'division_name' ELSE empty_uuid_array || ' AS division' END || ',
                            ' || CASE WHEN column_exists_in_table(form.table_name, 'subdivision_name') THEN 'subdivision_name' ELSE empty_uuid_array || ' AS subdivision' END || ',
                            ' || CASE WHEN column_exists_in_table(form.table_name, 'region_name') <> false THEN 'region_name' ELSE empty_uuid_array || ' AS region_name' END || ',
                            ' || CASE WHEN column_exists_in_table(form.table_name, 'zone_name') <> false THEN 'zone_name' ELSE empty_uuid_array || ' AS zone_name' END || ',
                            ' || CASE WHEN column_exists_in_table(form.table_name, 'mdm_payload_status') <> false THEN 'mdm_payload_status' ELSE empty_uuid_array || ' AS mdm_payload_status' END || ',

                            ''' || form.table_name || ''' as forms_table_name,
                            is_active::TEXT,
                            created_by::UUID,
                            ''' || form.id || '''::UUID as form_id,
                            ''' || form.project_id || '''::UUID as project_id
                        FROM
                            ' || form.table_name || '
                        WHERE
                            TICKET_ID IS NULL AND IS_ACTIVE = ''1'' ' || CASE WHEN "gaaColumnName" <> '' AND "gaaColumnValue" IS NOT NULL THEN ' AND ' || "gaaColumnName" || '[1] IN (''' || REPLACE("gaaColumnValue", ',', ''',''') || ''') ' ELSE '' END || '
                        UNION ALL
                        SELECT
                            ' || form.table_name || '_history.' || 'ID,
                            ' || form.table_name || '_history.' || 'created_at,
                            ' || form.table_name || '_history.' || 'created_at::DATE as "Created Date",
                            ' || CASE WHEN column_exists_in_table(form.table_name, 'l_a_approval_status') <> false THEN form.table_name || '_history.' || 'l_a_approval_status[1]::UUID AS l_a_approval_status' ELSE null_as_uuid || ' AS l_a_approval_status' END || ',
                            ' || CASE WHEN column_exists_in_table(form.table_name, 'l_b_approval_status') <> false THEN form.table_name || '_history.' || 'l_b_approval_status[1]::UUID AS l_b_approval_status' ELSE null_as_uuid || ' AS l_b_approval_status' END || ',
                            ' || CASE WHEN header_exists_in_table(form.table_name, 'Material Type ID') <> '' THEN form.table_name || '_history.' || header_exists_in_table(form.table_name, 'Material Type ID') ELSE empty_uuid_array || ' as material_type' END || ',
                            ' || CASE WHEN column_exists_in_table(form.table_name, 'circle_name') <> false THEN form.table_name || '_history.' || 'circle_name' ELSE empty_uuid_array || ' AS circle_name' END || ',
                            ' || CASE WHEN column_exists_in_table(form.table_name, 'division_name') <> false THEN form.table_name || '_history.' || 'division_name' ELSE empty_uuid_array || ' AS division' END || ',
                            ' || CASE WHEN column_exists_in_table(form.table_name, 'subdivision_name') <> false THEN form.table_name || '_history.' || 'subdivision_name' ELSE empty_uuid_array || ' AS subdivision' END || ',
                            ' || CASE WHEN column_exists_in_table(form.table_name, 'region_name') <> false THEN form.table_name || '_history.' || 'region_name' ELSE empty_uuid_array || ' AS region_name' END || ',
                            ' || CASE WHEN column_exists_in_table(form.table_name, 'zone_name') <> false THEN form.table_name || '_history.' || 'zone_name' ELSE empty_uuid_array || ' AS zone_name' END || ',
                            ' || CASE WHEN column_exists_in_table(form.table_name, 'mdm_payload_status') <> false THEN form.table_name || '_history.' || 'mdm_payload_status' ELSE empty_uuid_array || ' AS mdm_payload_status' END || ',
                            
                            ''' || form.table_name || '_history' || ''' as forms_table_name,
                            ' || form.table_name || '_history.' || 'is_active::TEXT,
                            ' || form.table_name || '_history.' || 'created_by::UUID,
                            ''' || form.id || '''::UUID as form_id,
                            ''' || form.project_id || '''::UUID as project_id
                        FROM
                            ' || form.table_name || '_history' || '
                            INNER JOIN (
                            SELECT
                                RECORD_ID,
                                MAX_COUNTER
                            FROM
                                (
                                SELECT
                                    RECORD_ID,
                                    MAX(COUNTER) AS MAX_COUNTER
                                FROM
                                    ' || form.table_name || '_history' || '
                                WHERE
                                    ' || form.table_name || '_history.' || 'TICKET_ID IS NULL
                                GROUP BY
                                    RECORD_ID
                                ) SUBQUERY
                            ) H2 ON H2.MAX_COUNTER =  ' || form.table_name || '_history.' || 'COUNTER
                            AND H2.RECORD_ID =  ' || form.table_name || '_history.' || 'RECORD_ID
                        WHERE
                            ' || form.table_name || '_history.' || 'RECORD_ID IN (
                            SELECT
                                ' || form.table_name || '.ID
                            FROM
                                ' || form.table_name || '
                            WHERE
                                TICKET_ID IS NOT NULL ' || CASE WHEN "gaaColumnName" <> '' AND "gaaColumnValue" IS NOT NULL THEN ' AND ' || "gaaColumnName" || '[1] IN (''' || REPLACE("gaaColumnValue", ',', ''',''') || ''') ' ELSE '' END || '
                            )';
                END IF;
        
                IF query_text IS NOT NULL THEN
                    query_text := query_text || ' UNION ' || table_query;
                ELSE
                    query_text := table_query;
                END IF;
            END LOOP;
        
            CLOSE forms_data;
        
            IF query_text IS NOT NULL THEN
                RETURN QUERY EXECUTE query_text;
            ELSE
                RETURN;
            END IF;
        END;
        $$ LANGUAGE plpgsql;
    `);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};

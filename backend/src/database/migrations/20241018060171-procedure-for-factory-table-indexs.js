"use strict";

const config = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
				CREATE OR REPLACE PROCEDURE created_all_required_indexs()
				LANGUAGE plpgsql
				AS $$
				DECLARE
					rec RECORD;
					create_index_query TEXT;
					drop_index_query TEXT;
				BEGIN
					-- Loop through the query result for index of factory table
					FOR rec IN
						SELECT
							FT.TABLE_NAME AS FACTORY_TABLE_NAME,
							FAT.COLUMN_NAME AS FACTORY_COLUMN_NAME,
							LOWER('INDEX_FACTORY_' || FT.TABLE_NAME || '_' || FAT.COLUMN_NAME) AS INDEX_NAME
						FROM
							FORMS AS F
						INNER JOIN FORM_ATTRIBUTES AS FA ON F.ID = FA.FORM_ID
						INNER JOIN FORMS AS FT ON FT.ID::TEXT = FA.PROPERTIES ->> 'factoryTable'
						INNER JOIN FORM_ATTRIBUTES AS FAT ON FAT.ID::TEXT = FA.PROPERTIES ->> 'linkColumn'
						INNER JOIN INFORMATION_SCHEMA.COLUMNS AS IFS ON IFS.COLUMN_NAME = FAT.COLUMN_NAME
	AND IFS.TABLE_NAME = FT.TABLE_NAME
						WHERE
							F.IS_PUBLISHED IS TRUE
							AND F.IS_ACTIVE = '1'
							AND FA.PROPERTIES ->> 'factoryTable' IS NOT NULL
							AND FA.PROPERTIES ->> 'factoryTable' <> ''
							AND FA.IS_ACTIVE = '1'
						GROUP BY
							FACTORY_TABLE_NAME,
							FACTORY_COLUMN_NAME
						ORDER BY
							FACTORY_TABLE_NAME
					LOOP

						-- Drop already created indexes
						drop_index_query := 'DROP INDEX IF EXISTS ' || rec.FACTORY_TABLE_NAME || '_' || rec.FACTORY_COLUMN_NAME || ';';

						-- RAISE NOTICE 'Executing: %', drop_index_query;
						-- EXECUTE drop_index_query;

						-- Dynamically generate the DROP INDEX query
						drop_index_query := 'DROP INDEX IF EXISTS ' || rec.INDEX_NAME || ';';
						-- RAISE NOTICE 'Executing: %', drop_index_query;
						-- EXECUTE drop_index_query;

						-- Dynamically generate the CREATE INDEX query
						create_index_query := 'CREATE INDEX IF NOT EXISTS ' || rec.INDEX_NAME || 
											' ON ' || rec.FACTORY_TABLE_NAME || 
											' (' || rec.FACTORY_COLUMN_NAME || ');';

						RAISE NOTICE 'Executing: %', create_index_query;
						EXECUTE create_index_query;
					END LOOP;

					-- Index for dynamic forms data mappings
					FOR rec IN
						SELECT
							MAPPER.TABLE_NAME AS MAPPING_TABLE,
							MAPPER_ATT.COLUMN_NAME AS MAPPING_COLUMN,
							LOWER(
								'INDEX_DATA_MAPPING_' || MAPPER.TABLE_NAME || '_' || MAPPER_ATT.COLUMN_NAME
							) AS INDEX_NAME
						FROM
							FORMS
							INNER JOIN FORMS AS MAPPER ON MAPPER.ID = FORMS.MAPPING_TABLE_ID
							INNER JOIN FORM_ATTRIBUTES AS MAPPER_ATT ON FORMS.SEARCH_COLUMNS && ARRAY[MAPPER_ATT.ID]::UUID []
							INNER JOIN INFORMATION_SCHEMA.COLUMNS AS IFS ON IFS.COLUMN_NAME = MAPPER_ATT.COLUMN_NAME
	AND IFS.TABLE_NAME = MAPPER.TABLE_NAME
						WHERE
							FORMS.IS_PUBLISHED IS TRUE AND FORMS.IS_ACTIVE = '1'
							AND MAPPER_ATT.IS_ACTIVE = '1'
						GROUP BY
							MAPPING_TABLE, MAPPER_ATT.COLUMN_NAME
						ORDER BY
							MAPPING_TABLE
					LOOP

						-- Dynamically generate the DROP INDEX query
						drop_index_query := 'DROP INDEX IF EXISTS ' || rec.INDEX_NAME || ';';
						-- RAISE NOTICE 'Executing: %', drop_index_query;
						-- EXECUTE drop_index_query;

						-- Dynamically generate the CREATE INDEX query
						create_index_query := 'CREATE INDEX IF NOT EXISTS ' || rec.INDEX_NAME ||
											' ON ' || rec.MAPPING_TABLE || ' (' || rec.MAPPING_COLUMN || ');';

						RAISE NOTICE 'Executing: %', create_index_query;
						EXECUTE create_index_query;
					END LOOP;

					-- CREATE INDEX for GAA columns

					FOR rec IN
						SELECT
							FORMS.TABLE_NAME AS FORM_NAME,
							'index_gaa_' || FORMS.TABLE_NAME || '_' || FA.COLUMN_NAME AS INDEX_NAME,
							FA.COLUMN_NAME AS GAA_COLUMNS
						FROM
							FORMS
							INNER JOIN FORM_ATTRIBUTES AS FA ON FA.FORM_ID = FORMS.ID
							INNER JOIN ALL_MASTERS_LIST AS AML ON AML.ID::TEXT = FA.PROPERTIES ->> 'sourceTable'
							INNER JOIN INFORMATION_SCHEMA.COLUMNS AS IFS ON IFS.COLUMN_NAME = FA.COLUMN_NAME
	AND IFS.TABLE_NAME = FORMS.TABLE_NAME
						WHERE
							AML.NAME = 'gaa_level_entries'
							AND FORMS.TABLE_NAME IS NOT NULL
							AND FORMS.IS_PUBLISHED IS TRUE AND FORMS.IS_ACTIVE = '1'
							AND FA.IS_ACTIVE = '1'
						GROUP BY
							FORM_NAME,
							GAA_COLUMNS
						ORDER BY
							FORM_NAME
					LOOP

						-- Dynamically generate the DROP INDEX query
						drop_index_query := 'DROP INDEX IF EXISTS ' || rec.INDEX_NAME || ';';
						-- RAISE NOTICE 'Executing: %', drop_index_query;
						-- EXECUTE drop_index_query;

						create_index_query := 'CREATE INDEX IF NOT EXISTS ' || rec.INDEX_NAME ||
											' ON ' || rec.FORM_NAME || ' USING GIN (' || rec.GAA_COLUMNS || ');';

						RAISE NOTICE 'Executing: %', create_index_query;
						EXECUTE create_index_query;
					END LOOP;

					-- CREATE INDEX for L1 and L2 approval status

					FOR rec IN
						SELECT
							FORMS.TABLE_NAME AS FORM_NAME,
							'index_approval_' || FORMS.TABLE_NAME || '_' || FA.COLUMN_NAME AS INDEX_NAME,
							FA.COLUMN_NAME AS APPROVAL_COLUMNS
						FROM
							FORMS
							INNER JOIN FORM_ATTRIBUTES AS FA ON FA.FORM_ID = FORMS.ID
							INNER JOIN INFORMATION_SCHEMA.COLUMNS AS IFS ON IFS.COLUMN_NAME = FA.COLUMN_NAME AND IFS.TABLE_NAME = FORMS.TABLE_NAME
						WHERE
							FORMS.IS_PUBLISHED IS TRUE
							AND FORMS.IS_ACTIVE = '1'
							AND FA.COLUMN_NAME ~ '^l_[a,b]_approval_status$'
							AND FA.IS_ACTIVE = '1'
						GROUP BY
							FORM_NAME,
							FA.COLUMN_NAME
						ORDER BY
							FORM_NAME
					LOOP

						-- Dynamically generate the DROP INDEX query
						drop_index_query := 'DROP INDEX IF EXISTS ' || rec.INDEX_NAME || ';';
						-- RAISE NOTICE 'Executing: %', drop_index_query;
						-- EXECUTE drop_index_query;

						create_index_query := 'CREATE INDEX IF NOT EXISTS ' || rec.INDEX_NAME ||
											' ON ' || rec.FORM_NAME || ' USING GIN (' || rec.APPROVAL_COLUMNS || ');';

						RAISE NOTICE 'Executing: %', create_index_query;
						EXECUTE create_index_query;
					END LOOP;

					FOR rec IN
						SELECT
							FORMS.TABLE_NAME AS FORM_NAME,
							'index_timestamp_' || FORMS.TABLE_NAME || '_' || IFS.COLUMN_NAME AS INDEX_NAME,
							IFS.COLUMN_NAME AS TIMESTMP_COLUMNS
						FROM
							FORMS
							INNER JOIN INFORMATION_SCHEMA.COLUMNS AS IFS ON IFS.TABLE_NAME = FORMS.TABLE_NAME
						WHERE
							IFS.COLUMN_NAME IN ('created_at', 'updated_at', 'submitted_at')
						GROUP BY
							FORM_NAME,
							TIMESTMP_COLUMNS
						ORDER BY
							FORM_NAME
					LOOP

						-- Dynamically generate the DROP INDEX query
						drop_index_query := 'DROP INDEX IF EXISTS ' || rec.INDEX_NAME || ';';
						-- RAISE NOTICE 'Executing: %', drop_index_query;
						-- EXECUTE drop_index_query;

						create_index_query := 'CREATE INDEX IF NOT EXISTS ' || rec.INDEX_NAME ||
											' ON ' || rec.FORM_NAME || ' (' || rec.TIMESTMP_COLUMNS || ');';

						RAISE NOTICE 'Executing: %', create_index_query;
						EXECUTE create_index_query;
					END LOOP;

					-- DROP INDEX IF CREATED PREVIOUSLY

					DROP INDEX IF EXISTS index_gaaid_parentid;
					DROP INDEX IF EXISTS idx_name_code_master_project;
					DROP INDEX IF EXISTS idx_name_code_master;

					-- ADD INDEX FOR ALL DROPDOWN FIELDS IN FORMS WITH SINGLE COLUMN
					CREATE INDEX IF NOT EXISTS index_gaaid_parentid ON ${config.GAA_LEVEL_ENTRIES} (parent_id);
					CREATE INDEX IF NOT EXISTS index_gaaid_name ON ${config.GAA_LEVEL_ENTRIES} (name);
					CREATE INDEX IF NOT EXISTS index_gaaid_gaa_hierarchy_id ON ${config.GAA_LEVEL_ENTRIES} (gaa_hierarchy_id);
					CREATE INDEX IF NOT EXISTS index_project_master_make_lovs_name ON ${config.PROJECT_MASTER_MAKER_LOVS} (name);
					CREATE INDEX IF NOT EXISTS index_master_make_lovs_name ON ${config.MASTER_MAKER_LOVS} (name);
					CREATE INDEX IF NOT EXISTS index_project_master_make_lovs_master_id ON ${config.PROJECT_MASTER_MAKER_LOVS} (master_id);
					CREATE INDEX IF NOT EXISTS index_master_make_lovs_master_id ON ${config.MASTER_MAKER_LOVS} (master_id);
					CREATE INDEX IF NOT EXISTS index_user_mobile_number ON ${config.USERS} (mobile_number);
					CREATE INDEX IF NOT EXISTS index_user_email ON ${config.USERS} (email);
					CREATE INDEX IF NOT EXISTS index_work_area_assignment_user_id ON ${config.WORK_AREA_ASSIGNMENT} (user_id);
					CREATE INDEX IF NOT EXISTS index_form_attributes_id ON ${config.FORM_ATTRIBUTES} (form_id);
				END $$;

				CALL created_all_required_indexs();
			`);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    },

    async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    }
};

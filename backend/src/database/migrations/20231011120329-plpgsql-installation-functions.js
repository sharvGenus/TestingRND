"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
		-- ======================================== Function to get active serial numbers ===============================================
		CREATE OR REPLACE FUNCTION serial_numbers(installerid UUID, projectid UUID)
		RETURNS TABLE (
		id UUID,
		material_id UUID,
		serial_number VARCHAR(255)
		)
		LANGUAGE 'plpgsql'
		AS $$
		BEGIN
			IF installerid IS NOT NULL AND projectid IS NOT NULL THEN
				RETURN QUERY SELECT sn.id, sn.material_id, sn.serial_number
					FROM "material_serial_numbers" sn
				INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
				WHERE
					sl.installer_id = installerid AND 
					sl.project_id = projectid AND
					sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
					sn.status = '1' AND
					sn.is_active = '1';
			ELSEIF projectid IS NOT NULL THEN
				RETURN QUERY SELECT sn.id, sn.material_id, sn.serial_number
					FROM "material_serial_numbers" sn
				INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
				WHERE
					sl.project_id = projectid AND
					sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
					sn.status = '1' AND
					sn.is_active = '1';
			ELSE
				RETURN QUERY SELECT sn.id, sn.material_id, sn.serial_number
					FROM "material_serial_numbers" sn
				INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
				WHERE
					sn.is_active = '1';
			END IF;
			END;
		$$;
		
		-- ======================================== Function to get serialize materials from factory file ==============================
		CREATE OR REPLACE FUNCTION public.serial_numbers(
			installerid uuid,
			projectid uuid,
			factory_table uuid,
			factory_column uuid,
			link_column uuid,
			source_column uuid)
			RETURNS TABLE(id uuid, material_id uuid, serial_number character varying, factory_value character varying) 
			LANGUAGE 'plpgsql'
			COST 100
			VOLATILE PARALLEL UNSAFE
			ROWS 1000
		
		AS $BODY$
			DECLARE
				factory_table_name text;
				factory_column_name text;
				link_column_name text;
				source_column_name text;
				query_text text := FORMAT($A$ SELECT table_name FROM forms WHERE id = '%s' $A$, factory_table);
			BEGIN
				EXECUTE query_text INTO factory_table_name;
				query_text := FORMAT($A$ SELECT column_name FROM form_attributes WHERE id = '%s' $A$, factory_column);
				EXECUTE query_text INTO factory_column_name;
				query_text := FORMAT($A$ SELECT column_name FROM form_attributes WHERE id = '%s' $A$, link_column);
				EXECUTE query_text INTO link_column_name;
				query_text := FORMAT($A$ SELECT name FROM all_master_columns WHERE id = '%s' $A$, source_column);
				EXECUTE query_text INTO source_column_name;

				-- IF installer id is provided but not the projectId
				IF installerid IS NOT NULL AND projectid IS NULL THEN
					query_text := FORMAT($A$
						SELECT sn.id, sn.material_id, sn.serial_number, ft.%I::character varying AS factory_value
							FROM "material_serial_numbers" sn
						INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
						INNER JOIN %I AS ft ON ft.%I = sn.%I
						WHERE
							sl.installer_id = '%s' AND 
							sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
							sn.status = '1' AND
							sn.is_active = '1'
						ORDER BY 
							serial_number ASC;
						$A$, factory_column_name, factory_table_name, link_column_name, source_column_name, installerid);
					RETURN QUERY EXECUTE query_text;

				-- IF both ids were provided
				ELSEIF installerid IS NOT NULL AND projectid IS NOT NULL THEN
					query_text := FORMAT($A$
						SELECT sn.id, sn.material_id, sn.serial_number, ft.%I::character varying AS factory_value
							FROM "material_serial_numbers" sn
						INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
						INNER JOIN %I AS ft ON ft.%I = sn.%I
						WHERE
							sl.installer_id = '%s' AND 
							sl.project_id = '%s' AND
							sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
							sn.status = '1' AND
							sn.is_active = '1'
						ORDER BY 
							serial_number ASC;
						$A$, factory_column_name, factory_table_name, link_column_name, source_column_name, installerid, projectid);
					RETURN QUERY EXECUTE query_text;

				-- if projectis not null and installer id is null
				ELSEIF projectid IS NOT NULL AND installerid IS NULL THEN
					query_text := FORMAT($A$
						SELECT sn.id, sn.material_id, sn.serial_number, ft.%I::character varying AS factory_value
							FROM "material_serial_numbers" sn
						INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
						INNER JOIN %I AS ft ON ft.%I = sn.%I
						WHERE
							sn.is_active = '1'
						ORDER BY 
							serial_number ASC;
						$A$, factory_column_name, factory_table_name, link_column_name, source_column_name);
					RETURN QUERY EXECUTE query_text;

				ELSE
					query_text := FORMAT($A$
						SELECT sn.id, sn.material_id, sn.serial_number, ft.%I::character varying AS factory_value
							FROM "material_serial_numbers" sn
						INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
						INNER JOIN %I AS ft ON ft.%I = sn.%I
						WHERE
							sn.is_active = '1'
						ORDER BY 
							serial_number ASC;
						$A$, factory_column_name, factory_table_name, link_column_name, source_column_name);
					RETURN QUERY EXECUTE query_text;
				END IF;
			END;		
		$BODY$;

		-- ======================================== Function to get non serialize materials ============================================
		CREATE OR REPLACE FUNCTION nonserialize_materials(installerid UUID, projectid UUID)
		RETURNS TABLE (
		id UUID,
		name VARCHAR(255),
		code VARCHAR(255)
		)
		LANGUAGE 'plpgsql'
		AS $$
		BEGIN
			IF installerid IS NOT NULL AND projectid IS NOT NULL THEN
				RETURN QUERY SELECT
					DISTINCT ON (sl.material_id) m.id,
					m.name,
					m.code
				FROM
					stock_ledgers sl
					INNER JOIN materials m ON sl.material_id = m.id
				WHERE
					sl.project_id = projectid
					AND sl.installer_id = installerid
					AND m.is_serial_number = false
				GROUP BY
					sl.project_id,
					sl.store_location_id,
					sl.installer_id,
					sl.material_id,
					m.id,
					m.code
				HAVING
					SUM(sl.quantity) > 0;
			ELSEIF installerid IS NULL AND projectid IS NOT NULL THEN
				RETURN QUERY SELECT
					DISTINCT ON (sl.material_id) m.id,
					m.name,
					m.code
				FROM
					stock_ledgers sl
					INNER JOIN materials m ON sl.material_id = m.id
				WHERE
					sl.project_id = projectid
					AND m.is_serial_number = false
				GROUP BY
					sl.project_id,
					sl.store_location_id,
					sl.installer_id,
					sl.material_id,
					m.id,
					m.code
				HAVING
					SUM(sl.quantity) > 0;
			ELSE
				RETURN QUERY SELECT
					DISTINCT ON (sl.material_id) m.id,
					m.name,
					m.code
				FROM
					stock_ledgers sl
					INNER JOIN materials m ON sl.material_id = m.id
				WHERE
					m.is_serial_number = false
				GROUP BY
					sl.project_id,
					sl.store_location_id,
					sl.installer_id,
					sl.material_id,
					m.id,
					m.code
				HAVING
					SUM(sl.quantity) > 0;
			END IF;
		END;
		$$;
      `);
    },

    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`
          DROP EXTENSION CASCADE IF EXISTS "uuid-ossp";
          DROP FUNCTION IF EXISTS serial_numbers;
          DROP FUNCTION IF EXISTS nonserialize_materials;
        `);
    }
};
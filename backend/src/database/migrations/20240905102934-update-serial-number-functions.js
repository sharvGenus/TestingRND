"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`
			DROP FUNCTION IF EXISTS PUBLIC.SERIAL_NUMBERS (
				UUID,
				UUID,
				UUID,
				UUID,
				UUID,
				UUID,
				UUID,
				UUID,
				UUID
			);

			CREATE
			OR REPLACE FUNCTION PUBLIC.SERIAL_NUMBERS (
				INSTALLERID UUID,
				PROJECTID UUID,
				FACTORY_TABLE UUID,
				FACTORY_COLUMN UUID,
				LINK_COLUMN UUID,
				SOURCE_COLUMN UUID,
				FORMID UUID,
				FROMATTRIBUTEID UUID,
				RESPONSEID UUID
			) RETURNS TABLE (
				ID UUID,
				MATERIAL_ID UUID,
				SERIAL_NUMBER CHARACTER VARYING,
				FACTORY_VALUE CHARACTER VARYING
			) LANGUAGE 'plpgsql' COST 100 VOLATILE PARALLEL UNSAFE ROWS 1000 AS $BODY$
				DECLARE
					dependeny text;
					factory_table_name text;
					factory_column_name text;
					link_column_name text;
					source_column_name text;
					query_text text := FORMAT($A$ SELECT table_name FROM forms WHERE id = '%s' $A$, factory_table);
					tablename text;
					columnname text;
					materialidarr uuid[];
				BEGIN
					SELECT table_name INTO factory_table_name FROM "forms" as frm WHERE frm.id = FACTORY_TABLE;
					SELECT column_name INTO factory_column_name FROM form_attributes AS fa WHERE fa.id = factory_column;
					SELECT column_name INTO link_column_name FROM form_attributes AS fa WHERE fa.id = link_column;
					SELECT name INTO source_column_name FROM all_master_columns amc WHERE amc.id = source_column;
		
					-- IF installer id is provided but not the projectId
					IF installerid IS NOT NULL AND projectid IS NULL THEN
						IF formid IS NOT NULL AND fromattributeid IS NOT NULL AND responseid IS NOT NULL THEN
							SELECT table_name INTO tablename FROM "forms" as frm WHERE frm.id = formid;
							SELECT faf.column_name INTO columnname FROM "form_attributes" as frm_attr 
								INNER JOIN form_attributes AS faf ON faf.id::text = frm_attr.properties ->> 'dependency'
								WHERE frm_attr.id = fromattributeid;

							IF tablename IS NOT NULL THEN
								EXECUTE 'SELECT ' || quote_ident(columnname) || ' FROM ' || quote_ident(tablename) || ' as tn WHERE tn.id = $1' INTO materialidarr USING responseid;
								IF array_length(materialidarr, 1) > 0 THEN
									-- Consumed
									query_text := FORMAT($A$
										SELECT sn.id, sn.material_id, sn.serial_number, ft.%I::character varying AS factory_value
										FROM "material_serial_numbers" sn
										INNER JOIN %I AS ft ON ft.%I = sn.%I
										WHERE sn.id = '%s' AND ft.is_active = '1' AND sn.is_active = '1'
										ORDER BY serial_number ASC;
								 	$A$, factory_column_name, factory_table_name, link_column_name, source_column_name, materialidarr[1]);
									-- RAISE NOTICE '1 %', query_text;
									RETURN QUERY EXECUTE query_text;
									-- Active
									query_text := FORMAT($A$
										SELECT sn.id, sn.material_id, sn.serial_number, ft.%I::character varying AS factory_value
										FROM "material_serial_numbers" sn
										INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
										INNER JOIN %I AS ft ON ft.%I = sn.%I
										WHERE
											sl.installer_id = (
												SELECT sl.installer_id
												FROM "stock_ledgers" AS sl
												WHERE sl.id = (
													SELECT sn.stock_ledger_id
													FROM "material_serial_numbers" sn
													WHERE sn.id = '%s'
												) 
											) AND
											sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
											sn.status = '1' AND
											sn.is_active = '1' AND ft.is_active = '1'
										ORDER BY serial_number ASC;
								 	$A$, factory_column_name, factory_table_name, link_column_name, source_column_name, materialidarr[1]);
									-- RAISE NOTICE '2 %', query_text;
									RETURN QUERY EXECUTE query_text;
								ELSE
									query_text := FORMAT($A$
										SELECT sn.id, sn.material_id, sn.serial_number, ft.%I::character varying AS factory_value
										FROM "material_serial_numbers" sn
										INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
										INNER JOIN %I AS ft ON ft.%I = sn.%I
										WHERE
											sl.installer_id = '%s' AND 
											sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
											sn.status = '1' AND
											sn.is_active = '1' AND ft.is_active = '1'
										ORDER BY serial_number ASC;
								 	$A$, factory_column_name, factory_table_name, link_column_name, source_column_name, installerid);
									-- RAISE NOTICE '3 %', query_text;
									RETURN QUERY EXECUTE query_text;
								END IF;
							END IF;
						ELSE
							query_text := FORMAT($A$
								SELECT sn.id, sn.material_id, sn.serial_number, ft.%I::character varying AS factory_value
								FROM "material_serial_numbers" sn
								INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
								INNER JOIN %I AS ft ON ft.%I = sn.%I
								WHERE
									sl.installer_id = '%s' AND 
									sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
									sn.status = '1' AND
									sn.is_active = '1' AND ft.is_active = '1'
								ORDER BY serial_number ASC;
						 	$A$, factory_column_name, factory_table_name, link_column_name, source_column_name, installerid);
							-- RAISE NOTICE '4 %', query_text;
							RETURN QUERY EXECUTE query_text;
						END IF;
		
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
								sn.is_active = '1' AND ft.is_active = '1'
							ORDER BY 
								serial_number ASC;
						 $A$, factory_column_name, factory_table_name, link_column_name, source_column_name, installerid, projectid);
						-- RAISE NOTICE '5 %', query_text;
						RETURN QUERY EXECUTE query_text;
		
					-- if projectis not null and installer id is null
					ELSEIF projectid IS NOT NULL AND installerid IS null THEN
						query_text := FORMAT($A$
							SELECT sn.id, sn.material_id, sn.serial_number, ft.%I::character varying AS factory_value
								FROM "material_serial_numbers" sn
							INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
							INNER JOIN %I AS ft ON ft.%I = sn.%I
							WHERE
								sl.project_id = '%s' AND
								sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
								sn.status = '1' AND
								sn.is_active = '1' AND ft.is_active = '1'
							ORDER BY 
								serial_number ASC;
						 $A$, factory_column_name, factory_table_name, link_column_name, source_column_name, projectid);
						-- RAISE NOTICE '6 %', query_text;
						RETURN QUERY EXECUTE query_text;
		
					ELSE
						query_text := FORMAT($A$
							SELECT sn.id, sn.material_id, sn.serial_number, ft.%I::character varying AS factory_value
								FROM "material_serial_numbers" sn
							INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
							INNER JOIN %I AS ft ON ft.%I = sn.%I
							WHERE
								sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
								sn.status = '1' AND
								sn.is_active = '1' AND ft.is_active = '1'
							ORDER BY 
								serial_number ASC;
						 $A$, factory_column_name, factory_table_name, link_column_name, source_column_name);
						-- RAISE NOTICE '6 %', query_text;
						RETURN QUERY EXECUTE query_text;
					END IF;
			END;
		$BODY$;
      `);
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

"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`
    -- FUNCTION: public.nonserialize_materials(uuid, uuid, uuid, uuid, uuid)

DROP FUNCTION IF EXISTS public.nonserialize_materials(uuid, uuid, uuid, uuid, uuid);

CREATE OR REPLACE FUNCTION public.nonserialize_materials(
	installerid uuid,
	projectid uuid,
	formid uuid,
	fromattributeid uuid,
	responseid uuid)
    RETURNS TABLE(id uuid, name text, quantity double precision) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
                DECLARE
                    tablename VARCHAR(255);
                    columnname VARCHAR(255);
                    ctr INT;
                    materialidarr UUID[];
                BEGIN
                    IF installerid IS NOT NULL AND projectid IS NOT NULL THEN
                        IF formid IS NOT NULL AND fromattributeid IS NOT NULL AND responseid IS NOT NULL THEN
                            SELECT table_name INTO tablename FROM "forms" as frm WHERE frm.id = formid;
                            SELECT column_name INTO columnname FROM "form_attributes" as frm_attr WHERE frm_attr.id = fromattributeid;
                            IF tablename IS NOT NULL THEN
                                EXECUTE 'SELECT counter, ' || quote_ident(columnname) || ' FROM ' || quote_ident(tablename) || ' as tn WHERE tn.id = $1' INTO ctr, materialidarr USING responseid;
                                IF array_length(materialidarr, 1) > 0 THEN
                                    RETURN QUERY 
                                    SELECT m.id AS id, m.name::text AS name, sum(sl.quantity) AS quantity
                                    FROM stock_ledgers sl
                                    INNER JOIN materials m ON sl.material_id = m.id
                                    INNER JOIN master_maker_lovs mml ON m.uom_id = mml.id
                                    WHERE
                                        sl.installer_id = (
                                            SELECT sld.installer_id 
                                            FROM "stock_ledger_details" sld
                                            WHERE 
                                                sld.counter = ctr AND
                                                sld.response_id = responseid AND
                                                sld.project_id = projectid AND
                                                sld.non_serialize_material_id = materialidarr[1]
                                        ) AND
                                        sl.project_id = projectid AND
                                        m.is_serial_number = false
                                    GROUP BY
                                        m.id, m.name
                                    HAVING SUM(sl.quantity) >= 0;
                                ELSE
                                    RETURN QUERY 
                                    SELECT m.id AS id, m.name::text AS name, sum(sl.quantity) AS quantity
                                    FROM stock_ledgers sl
                                    INNER JOIN materials m ON sl.material_id = m.id
                                    INNER JOIN master_maker_lovs mml ON m.uom_id = mml.id
                                    WHERE
                                        sl.project_id = projectid AND
                                        sl.installer_id = installerid AND
                                        m.is_serial_number = false
                                    GROUP BY
                                        m.id, m.name
                                    HAVING SUM(sl.quantity) >= 0;
                                END IF;
                            END IF;
                        ELSE
                            RETURN QUERY 
                            SELECT m.id AS id, m.name::text AS name, sum(sl.quantity) AS quantity
                            FROM stock_ledgers sl
                            INNER JOIN materials m ON sl.material_id = m.id
                            INNER JOIN master_maker_lovs mml ON m.uom_id = mml.id
                            WHERE
                                sl.project_id = projectid AND
                                sl.installer_id = installerid AND
                                m.is_serial_number = false
                            GROUP BY
                                m.id, m.name
                            HAVING SUM(sl.quantity) >= 0;
                        END IF;
                    ELSEIF installerid IS NULL AND projectid IS NOT NULL THEN
                        RETURN QUERY
                        SELECT m.id AS id, m.name::text AS name, sum(sl.quantity) AS quantity
                        FROM stock_ledgers sl
                        INNER JOIN materials m ON sl.material_id = m.id
                        INNER JOIN master_maker_lovs mml ON m.uom_id = mml.id
                        WHERE
                            sl.project_id = projectid AND 
                            m.is_serial_number = false
                        GROUP BY
                            m.id, m.name
                        HAVING SUM(sl.quantity) >= 0;
                    ELSE
                        RETURN QUERY
                        SELECT m.id AS id, m.name::text AS name, sum(sl.quantity) AS quantity
                        FROM stock_ledgers sl
                        INNER JOIN materials m ON sl.material_id = m.id
                        INNER JOIN master_maker_lovs mml ON m.uom_id = mml.id
                        WHERE m.is_serial_number = false
                        GROUP BY
                            m.id, m.name
                        HAVING SUM(sl.quantity) >= 0;
                    END IF;
                END;
                
        
$BODY$;

ALTER FUNCTION public.nonserialize_materials(uuid, uuid, uuid, uuid, uuid)
    OWNER TO postgres;


-- FUNCTION: public.serial_numbers(uuid, uuid, uuid, uuid, uuid, uuid, uuid, uuid, uuid)

DROP FUNCTION IF EXISTS public.serial_numbers(uuid, uuid, uuid, uuid, uuid, uuid, uuid, uuid, uuid);

CREATE OR REPLACE FUNCTION public.serial_numbers(
	installerid uuid,
	projectid uuid,
	factory_table uuid,
	factory_column uuid,
	link_column uuid,
	source_column uuid,
	formid uuid,
	fromattributeid uuid,
	responseid uuid)
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
					tablename text;
					columnname text;
					materialidarr uuid[];
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
						IF formid IS NOT NULL AND fromattributeid IS NOT NULL AND responseid IS NOT NULL THEN
							SELECT table_name INTO tablename FROM "forms" as frm WHERE frm.id = formid;
							SELECT column_name INTO columnname FROM "form_attributes" as frm_attr WHERE frm_attr.id = fromattributeid;
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
						RETURN QUERY EXECUTE query_text;
					END IF;
					END;
		
        
$BODY$;

ALTER FUNCTION public.serial_numbers(uuid, uuid, uuid, uuid, uuid, uuid, uuid, uuid, uuid)
    OWNER TO postgres;

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

"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
		-- FUNCTION: public.serialize_material_type(uuid, uuid) =============================================================

        DROP FUNCTION IF EXISTS public.serialize_material_type(uuid, uuid);

        CREATE OR REPLACE FUNCTION public.serialize_material_type(
            installerid uuid,
            projectid uuid)
            RETURNS TABLE(id uuid, serial_number character varying) 
            LANGUAGE 'plpgsql'
            COST 100
            VOLATILE PARALLEL UNSAFE
            ROWS 1000

        AS $BODY$
        BEGIN
            IF installerid IS NOT NULL AND projectid IS NOT NULL THEN
                RETURN QUERY SELECT DISTINCT m.material_type_id, sn.serial_number
                FROM "material_serial_numbers" sn
                INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
                INNER JOIN "materials" AS m ON sn.material_id = m.id
                WHERE
                    sl.installer_id = installerid AND 
                    sl.project_id = projectid AND
                    sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
                    sn.status = '1' AND
                    sn.is_active = '1'
                ORDER BY sn.serial_number ASC;
            ELSEIF projectid IS NOT NULL THEN
                RETURN QUERY SELECT DISTINCT m.material_type_id, sn.serial_number
                FROM "material_serial_numbers" sn
                INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
                INNER JOIN "materials" AS m ON sn.material_id = m.id
                WHERE
                    sl.project_id = projectid AND
                    sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
                    sn.status = '1' AND
                    sn.is_active = '1'
                ORDER BY sn.serial_number ASC;
            ELSE
                RETURN QUERY SELECT DISTINCT m.material_type_id, sn.serial_number
                FROM "material_serial_numbers" sn
                INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
                INNER JOIN "materials" AS m ON sn.material_id = m.id
                WHERE sn.is_active = '1'
                ORDER BY sn.serial_number ASC;
            END IF;
        END;
        
        $BODY$;

        -- FUNCTION: public.serialize_material_type(uuid, uuid, uuid, uuid, uuid) ===========================================

        DROP FUNCTION IF EXISTS public.serialize_material_type(uuid, uuid, uuid, uuid, uuid);

        CREATE OR REPLACE FUNCTION public.serialize_material_type(
            installerid uuid,
            projectid uuid,
            formid uuid,
            fromattributeid uuid,
            responseid uuid)
            RETURNS TABLE(id uuid, serial_number character varying) 
            LANGUAGE 'plpgsql'
            COST 100
            VOLATILE PARALLEL UNSAFE
            ROWS 1000

        AS $BODY$
		DECLARE
			tablename VARCHAR(255);
			columnname VARCHAR(255);
			materialidarr UUID[];
		BEGIN
			IF installerid IS NOT NULL AND projectid IS NOT NULL THEN
				IF formid IS NOT NULL AND fromattributeid IS NOT NULL AND responseid IS NOT NULL THEN
					SELECT table_name INTO tablename FROM "forms" as frm WHERE frm.id = formid;
					SELECT column_name INTO columnname FROM "form_attributes" as frm_attr WHERE frm_attr.id = fromattributeid;
					IF tablename IS NOT NULL THEN
						EXECUTE 'SELECT ' || quote_ident(columnname) || ' FROM ' || quote_ident(tablename) || ' as tn WHERE tn.id = $1' INTO materialidarr USING responseid;
                        -- All in a project
                        RETURN QUERY
                        SELECT DISTINCT m.material_type_id, sn.serial_number
                        FROM "material_serial_numbers" sn
                        INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
                        INNER JOIN "materials" AS m ON sn.material_id = m.id
                        WHERE
                            sl.installer_id IS NOT NULL AND 
                            sl.project_id = projectid AND
                            sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
                            sn.is_active = '1'
                        ORDER BY sn.serial_number ASC;
					END IF;
				ELSE
					RETURN QUERY
                    SELECT DISTINCT m.material_type_id, sn.serial_number
					FROM "material_serial_numbers" sn
					INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
					INNER JOIN "materials" AS m ON sn.material_id = m.id
					WHERE
						sl.installer_id = installerid AND 
						sl.project_id = projectid AND
						sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
						sn.status = '1' AND
						sn.is_active = '1'
					ORDER BY sn.serial_number ASC;
				END IF;
			ELSIF projectid IS NOT NULL THEN
				RETURN QUERY
                SELECT DISTINCT m.material_type_id, sn.serial_number
				FROM "material_serial_numbers" sn
				INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
				INNER JOIN "materials" AS m ON sn.material_id = m.id
				WHERE
					sl.project_id = projectid AND
					sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
					sn.status = '1' AND
					sn.is_active = '1'
				ORDER BY sn.serial_number ASC;
			ELSE
				RETURN QUERY
                SELECT DISTINCT m.material_type_id, sn.serial_number
				FROM "material_serial_numbers" sn
				INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
				INNER JOIN "materials" AS m ON sn.material_id = m.id
				WHERE sn.is_active = '1'
				ORDER BY sn.serial_number ASC;
			END IF;
		END;
		
        $BODY$;
      `);
    },

    async down(queryInterface, Sequelize) {
        // Down
    }
};
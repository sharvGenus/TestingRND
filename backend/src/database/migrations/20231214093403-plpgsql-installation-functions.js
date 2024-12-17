"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        -- ======================================================= Drop functions =======================================================
        DROP FUNCTION IF EXISTS serial_numbers(UUID, UUID);
        DROP FUNCTION IF EXISTS serial_numbers(UUID, UUID, UUID, UUID, UUID);
        DROP FUNCTION IF EXISTS nonserialize_materials(UUID, UUID);
        DROP FUNCTION IF EXISTS nonserialize_materials(UUID, UUID, UUID, UUID, UUID);

        -- =========================================== Function to get active serial numbers ============================================
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
                    sn.is_active = '1'
                ORDER BY sn.serial_number ASC;
            ELSEIF projectid IS NOT NULL THEN
                RETURN QUERY SELECT sn.id, sn.material_id, sn.serial_number
                FROM "material_serial_numbers" sn
                INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
                WHERE
                    sl.project_id = projectid AND
                    sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
                    sn.status = '1' AND
                    sn.is_active = '1'
                ORDER BY sn.serial_number ASC;
            ELSE
                RETURN QUERY SELECT sn.id, sn.material_id, sn.serial_number
                FROM "material_serial_numbers" sn
                INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
                WHERE sn.is_active = '1'
                ORDER BY sn.serial_number ASC;              
            END IF;
        END;
        $$;

        -- ======================================== Function to get consumed and active serial numbers ==================================
        CREATE OR REPLACE FUNCTION serial_numbers(
            installerid UUID, 
            projectid UUID,
            formid UUID, 
            fromattributeid UUID, 
            responseid UUID
        )
        RETURNS TABLE (
            id UUID,
            material_id UUID,
            serial_number VARCHAR(255)
        )
        LANGUAGE 'plpgsql'
        AS $$
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
                        IF array_length(materialidarr, 1) > 0 THEN
                            -- Consumed
                            RETURN QUERY
                            SELECT sn.id, sn.material_id, sn.serial_number
                            FROM "material_serial_numbers" sn
                            WHERE sn.id = ANY(materialidarr)
                            ORDER BY sn.serial_number ASC;
                            -- Active
                            RETURN QUERY
                            SELECT sn.id, sn.material_id, sn.serial_number
                            FROM "material_serial_numbers" sn
                            INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
                            WHERE
                                sl.installer_id = (
                                    SELECT sl.installer_id
                                    FROM "stock_ledgers" AS sl
                                    WHERE sl.id = (
                                        SELECT sn.stock_ledger_id
                                        FROM "material_serial_numbers" sn
                                        WHERE sn.id = materialidarr[1]
                                    ) 
                                ) AND 
                                sl.project_id = projectid AND
                                sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
                                sn.status = '1' AND
                                sn.is_active = '1'
                            ORDER BY sn.serial_number ASC;
                        ELSE
                            RETURN QUERY
                            SELECT sn.id, sn.material_id, sn.serial_number
                            FROM "material_serial_numbers" sn
                            INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
                            WHERE
                                sl.installer_id = installerid AND 
                                sl.project_id = projectid AND
                                sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
                                sn.status = '1' AND
                                sn.is_active = '1'
                            ORDER BY sn.serial_number ASC;
                        END IF;
                    END IF;
                ELSE
                    RETURN QUERY
                    SELECT sn.id, sn.material_id, sn.serial_number
                    FROM "material_serial_numbers" sn
                    INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
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
                SELECT sn.id, sn.material_id, sn.serial_number
                FROM "material_serial_numbers" sn
                INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
                WHERE
                    sl.project_id = projectid AND
                    sl.transaction_type_id != 'cb92ec5a-3f86-48cf-86b8-9359dda410a5' AND
                    sn.status = '1' AND
                    sn.is_active = '1'
                ORDER BY sn.serial_number ASC;
            ELSE
                RETURN QUERY
                SELECT sn.id, sn.material_id, sn.serial_number
                FROM "material_serial_numbers" sn
                INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
                WHERE sn.is_active = '1'
                ORDER BY sn.serial_number ASC;
            END IF;
        END;
        $$;

        -- ================================ Function to get active serial numbers with material type id =================================
        CREATE OR REPLACE FUNCTION serialize_material_type(installerid UUID, projectid UUID)
        RETURNS TABLE (
            id UUID,
            serial_number VARCHAR(255)
        )
        LANGUAGE 'plpgsql'
        AS $$
        BEGIN
            IF installerid IS NOT NULL AND projectid IS NOT NULL THEN
                RETURN QUERY SELECT m.material_type_id, sn.serial_number
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
                RETURN QUERY SELECT m.material_type_id, sn.serial_number
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
                RETURN QUERY SELECT m.material_type_id, sn.serial_number
                FROM "material_serial_numbers" sn
                INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
                INNER JOIN "materials" AS m ON sn.material_id = m.id
                WHERE sn.is_active = '1'
                ORDER BY sn.serial_number ASC;
            END IF;
        END;
        $$;        

		-- =========================== Function to get all serial numbers with material type id in a project ============================
		CREATE OR REPLACE FUNCTION serialize_material_type(
			installerid UUID, 
			projectid UUID,
			formid UUID, 
			fromattributeid UUID, 
			responseid UUID
		)
		RETURNS TABLE (
			id UUID,
			serial_number VARCHAR(255)
		)
		LANGUAGE 'plpgsql'
		AS $$
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
                    SELECT m.material_type_id, sn.serial_number
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
                SELECT m.material_type_id, sn.serial_number
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
                SELECT m.material_type_id, sn.serial_number
				FROM "material_serial_numbers" sn
				INNER JOIN "stock_ledgers" AS sl ON sn.stock_ledger_id = sl.id
				INNER JOIN "materials" AS m ON sn.material_id = m.id
				WHERE sn.is_active = '1'
				ORDER BY sn.serial_number ASC;
			END IF;
		END;
		$$;        

        -- ======================================== Function to get active non serialize materials =====================================
        CREATE OR REPLACE FUNCTION nonserialize_materials(installerid UUID, projectid UUID)
        RETURNS TABLE (
            id UUID,
            name VARCHAR(255),
            code VARCHAR(255),
            quantity FLOAT
        )
        LANGUAGE 'plpgsql'
        AS $$
        BEGIN
            IF installerid IS NOT NULL AND projectid IS NOT NULL THEN
                RETURN QUERY 
                SELECT DISTINCT ON (sl.material_id) m.id, m.name, m.code, SUM(sl.quantity) AS quantity
                FROM stock_ledgers sl
                INNER JOIN materials m ON sl.material_id = m.id
                WHERE
                    sl.project_id = projectid AND 
                    sl.installer_id = installerid AND 
                    m.is_serial_number = false
                GROUP BY
                    sl.project_id,
                    sl.store_location_id,
                    sl.installer_id,
                    sl.material_id,
                    m.id,
                    m.code
                HAVING SUM(sl.quantity) > 0;
            ELSEIF installerid IS NULL AND projectid IS NOT NULL THEN
                RETURN QUERY
                SELECT DISTINCT ON (sl.material_id) m.id, m.name, m.code, SUM(sl.quantity) AS quantity
                FROM stock_ledgers sl
                INNER JOIN materials m ON sl.material_id = m.id
                WHERE
                    sl.project_id = projectid AND 
                    m.is_serial_number = false
                GROUP BY
                    sl.project_id,
                    sl.store_location_id,
                    sl.installer_id,
                    sl.material_id,
                    m.id,
                    m.code
                HAVING SUM(sl.quantity) > 0;
            ELSE
                RETURN QUERY
                SELECT DISTINCT ON (sl.material_id) m.id, m.name, m.code, SUM(sl.quantity) AS quantity
                FROM stock_ledgers sl
                INNER JOIN materials m ON sl.material_id = m.id
                WHERE m.is_serial_number = false
                GROUP BY
                    sl.project_id,
                    sl.store_location_id,
                    sl.installer_id,
                    sl.material_id,
                    m.id,
                    m.code
                HAVING SUM(sl.quantity) > 0;
            END IF;
        END;
        $$;

        -- ================================== Function to get consumed and active non serialize materials ==============================
        CREATE OR REPLACE FUNCTION nonserialize_materials(
            installerid UUID, 
            projectid UUID,
            formid UUID, 
            fromattributeid UUID, 
            responseid UUID
        )
        RETURNS TABLE (
            id UUID,
            name VARCHAR(255),
            code VARCHAR(255),
            quantity FLOAT
        )
        LANGUAGE 'plpgsql'
        AS $$
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
                            SELECT DISTINCT ON (sl.material_id) m.id, m.name, m.code, SUM(sl.quantity) AS quantity
                            FROM stock_ledgers sl
                            INNER JOIN materials m ON sl.material_id = m.id
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
                                sl.project_id,
                                sl.store_location_id,
                                sl.installer_id,
                                sl.material_id,
                                m.id,
                                m.code
                            HAVING SUM(sl.quantity) >= 0;
                        ELSE
                            RETURN QUERY 
                            SELECT DISTINCT ON (sl.material_id) m.id, m.name, m.code, SUM(sl.quantity) AS quantity
                            FROM stock_ledgers sl
                            INNER JOIN materials m ON sl.material_id = m.id
                            WHERE
                                sl.project_id = projectid AND
                                sl.installer_id = installerid AND
                                m.is_serial_number = false
                            GROUP BY
                                sl.project_id,
                                sl.store_location_id,
                                sl.installer_id,
                                sl.material_id,
                                m.id,
                                m.code
                            HAVING SUM(sl.quantity) >= 0;
                        END IF;
                    END IF;
                ELSE
                    RETURN QUERY 
                    SELECT DISTINCT ON (sl.material_id) m.id, m.name, m.code, SUM(sl.quantity) AS quantity
                    FROM stock_ledgers sl
                    INNER JOIN materials m ON sl.material_id = m.id
                    WHERE
                        sl.project_id = projectid AND
                        sl.installer_id = installerid AND
                        m.is_serial_number = false
                    GROUP BY
                        sl.project_id,
                        sl.store_location_id,
                        sl.installer_id,
                        sl.material_id,
                        m.id,
                        m.code
                    HAVING SUM(sl.quantity) >= 0;
                END IF;
            ELSEIF installerid IS NULL AND projectid IS NOT NULL THEN
                RETURN QUERY
                SELECT DISTINCT ON (sl.material_id) m.id, m.name, m.code, SUM(sl.quantity) AS quantity
                FROM stock_ledgers sl
                INNER JOIN materials m ON sl.material_id = m.id
                WHERE
                    sl.project_id = projectid AND 
                    m.is_serial_number = false
                GROUP BY
                    sl.project_id,
                    sl.store_location_id,
                    sl.installer_id,
                    sl.material_id,
                    m.id,
                    m.code
                HAVING SUM(sl.quantity) >= 0;
            ELSE
                RETURN QUERY
                SELECT DISTINCT ON (sl.material_id) m.id, m.name, m.code, SUM(sl.quantity) AS quantity
                FROM stock_ledgers sl
                INNER JOIN materials m ON sl.material_id = m.id
                WHERE m.is_serial_number = false
                GROUP BY
                    sl.project_id,
                    sl.store_location_id,
                    sl.installer_id,
                    sl.material_id,
                    m.id,
                    m.code
                HAVING SUM(sl.quantity) >= 0;
            END IF;
        END;
        $$;
      `);
    },

    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`
          DROP FUNCTION IF EXISTS serialize_material_type;
        `);
    }
};
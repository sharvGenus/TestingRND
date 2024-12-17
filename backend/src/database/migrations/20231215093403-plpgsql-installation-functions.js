"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        -- ======================================================= Drop functions =======================================================
        DROP FUNCTION IF EXISTS nonserialize_materials(UUID, UUID);
        DROP FUNCTION IF EXISTS nonserialize_materials(UUID, UUID, UUID, UUID, UUID);

        -- ======================================== Function to get active non serialize materials =====================================
        CREATE OR REPLACE FUNCTION nonserialize_materials(installerid UUID, projectid UUID)
        RETURNS TABLE (
            id UUID,
            name TEXT,
            code VARCHAR(255)
        )
        LANGUAGE 'plpgsql'
        AS $$
        BEGIN
            IF installerid IS NOT NULL AND projectid IS NOT NULL THEN
                RETURN QUERY 
                SELECT DISTINCT ON (sl.material_id) m.id, m.name || ' (' || SUM(sl.quantity) || ' ' || mml.name || ')' AS name, m.code
                FROM stock_ledgers sl
                INNER JOIN materials m ON sl.material_id = m.id
                INNER JOIN master_maker_lovs mml ON m.uom_id = mml.id
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
                    m.code,
					mml.name
                HAVING SUM(sl.quantity) > 0;
            ELSEIF installerid IS NULL AND projectid IS NOT NULL THEN
                RETURN QUERY
                SELECT DISTINCT ON (sl.material_id) m.id, m.name || ' (' || SUM(sl.quantity) || ' ' || mml.name || ')' AS name, m.code
                FROM stock_ledgers sl
                INNER JOIN materials m ON sl.material_id = m.id
                INNER JOIN master_maker_lovs mml ON m.uom_id = mml.id 
                WHERE
                    sl.project_id = projectid AND 
                    m.is_serial_number = false
                GROUP BY
                    sl.project_id,
                    sl.store_location_id,
                    sl.installer_id,
                    sl.material_id,
                    m.id,
                    m.code,
					mml.name
                HAVING SUM(sl.quantity) > 0;
            ELSE
                RETURN QUERY
                SELECT DISTINCT ON (sl.material_id) m.id, m.name || ' (' || SUM(sl.quantity) || ' ' || mml.name || ')' AS name, m.code
                FROM stock_ledgers sl
                INNER JOIN materials m ON sl.material_id = m.id
                INNER JOIN master_maker_lovs mml ON m.uom_id = mml.id
                WHERE m.is_serial_number = false
                GROUP BY
                    sl.project_id,
                    sl.store_location_id,
                    sl.installer_id,
                    sl.material_id,
                    m.id,
                    m.code,
					mml.name
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
            name TEXT,
            code VARCHAR(255)
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
                            SELECT DISTINCT ON (sl.material_id) m.id, m.name || ' (' || SUM(sl.quantity) || ' ' || mml.name || ')' AS name, m.code
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
                                sl.project_id,
                                sl.store_location_id,
                                sl.installer_id,
                                sl.material_id,
                                m.id,
                                m.code,
                                mml.name
                            HAVING SUM(sl.quantity) >= 0;
                        ELSE
                            RETURN QUERY 
                            SELECT DISTINCT ON (sl.material_id) m.id, m.name || ' (' || SUM(sl.quantity) || ' ' || mml.name || ')' AS name, m.code
                            FROM stock_ledgers sl
                            INNER JOIN materials m ON sl.material_id = m.id
                            INNER JOIN master_maker_lovs mml ON m.uom_id = mml.id
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
                                m.code,
                                mml.name
                            HAVING SUM(sl.quantity) >= 0;
                        END IF;
                    END IF;
                ELSE
                    RETURN QUERY 
                    SELECT DISTINCT ON (sl.material_id) m.id, m.name || ' (' || SUM(sl.quantity) || ' ' || mml.name || ')' AS name, m.code
                    FROM stock_ledgers sl
                    INNER JOIN materials m ON sl.material_id = m.id
                    INNER JOIN master_maker_lovs mml ON m.uom_id = mml.id
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
                        m.code,
                        mml.name
                    HAVING SUM(sl.quantity) >= 0;
                END IF;
            ELSEIF installerid IS NULL AND projectid IS NOT NULL THEN
                RETURN QUERY
                SELECT DISTINCT ON (sl.material_id) m.id, m.name || ' (' || SUM(sl.quantity) || ' ' || mml.name || ')' AS name, m.code
                FROM stock_ledgers sl
                INNER JOIN materials m ON sl.material_id = m.id
                INNER JOIN master_maker_lovs mml ON m.uom_id = mml.id
                WHERE
                    sl.project_id = projectid AND 
                    m.is_serial_number = false
                GROUP BY
                    sl.project_id,
                    sl.store_location_id,
                    sl.installer_id,
                    sl.material_id,
                    m.id,
                    m.code,
					mml.name
                HAVING SUM(sl.quantity) >= 0;
            ELSE
                RETURN QUERY
                SELECT DISTINCT ON (sl.material_id) m.id, m.name || ' (' || SUM(sl.quantity) || ' ' || mml.name || ')' AS name, m.code
                FROM stock_ledgers sl
                INNER JOIN materials m ON sl.material_id = m.id
                INNER JOIN master_maker_lovs mml ON m.uom_id = mml.id
                WHERE m.is_serial_number = false
                GROUP BY
                    sl.project_id,
                    sl.store_location_id,
                    sl.installer_id,
                    sl.material_id,
                    m.id,
                    m.code,
					mml.name
                HAVING SUM(sl.quantity) >= 0;
            END IF;
        END;
        $$;
      `);
    },

    async down(queryInterface, Sequelize) {
        // Down
    }
};
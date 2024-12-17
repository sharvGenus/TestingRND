"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        -- ======================================================= Drop functions =======================================================
        DROP FUNCTION IF EXISTS nonserialize_materials(UUID, UUID);
        DROP FUNCTION IF EXISTS nonserialize_materials(UUID, UUID, UUID, UUID, UUID);

        -- ======================================== Function to get active non serialize materials =====================================
        CREATE OR REPLACE FUNCTION public.nonserialize_materials(
            installerid uuid,
            projectid uuid)
            RETURNS TABLE(id uuid, name text, quantity double precision) 
            LANGUAGE 'plpgsql'
            COST 100
            VOLATILE PARALLEL UNSAFE
            ROWS 1000
        
        AS $BODY$
                BEGIN
                    IF installerid IS NOT NULL AND projectid IS NOT NULL THEN
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
                        HAVING SUM(sl.quantity) > 0;
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
                        HAVING SUM(sl.quantity) > 0;
                    ELSE
                        RETURN QUERY
                        SELECT m.id AS id, m.name::text AS name, sum(sl.quantity) AS quantity
                        FROM stock_ledgers sl
                        INNER JOIN materials m ON sl.material_id = m.id
                        INNER JOIN master_maker_lovs mml ON m.uom_id = mml.id
                        WHERE m.is_serial_number = false
                        GROUP BY
                            m.id, m.name
                        HAVING SUM(sl.quantity) > 0;
                    END IF;
                END;
                
        $BODY$;

        -- ================================== Function to get consumed and active non serialize materials ==============================
        CREATE OR REPLACE FUNCTION public.nonserialize_materials(
            installerid uuid,
            projectid uuid,
            formid uuid,
            fromattributeid uuid,
            responseid uuid)
            RETURNS TABLE(id uuid, name text, code character varying, quantity double precision) 
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
      `);
    },

    async down(queryInterface, Sequelize) {
        // Down
    }
};
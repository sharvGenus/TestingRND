"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`
      -- FUNCTION: public.serial_numbers(uuid, uuid, uuid, uuid, uuid, uuid)

      DROP FUNCTION IF EXISTS public.serial_numbers(uuid, uuid, uuid, uuid, uuid, uuid);
      
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
                      sn.is_active = '1'
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
                      sn.is_active = '1'
                    ORDER BY 
                      serial_number ASC;
                  $A$, factory_column_name, factory_table_name, link_column_name, source_column_name);
                  RETURN QUERY EXECUTE query_text;
                END IF;
                END;
              
          
              
      $BODY$;
      
      ALTER FUNCTION public.serial_numbers(uuid, uuid, uuid, uuid, uuid, uuid)
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

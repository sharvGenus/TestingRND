"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        const queryToRun = `
        -- This procedure deletes the entries from all tables that have a foreign key reference to the 'all_masters_list' table
        -- for the specific UUIDs provided in the 'ptpr_uuids' variable.
        -- After deleting the entries from the other tables, it also deletes the corresponding entries from the 'all_masters_list' table.
        CREATE OR REPLACE PROCEDURE delete_ptpr_entries()
        LANGUAGE plpgsql
        AS $$
        DECLARE
            rec RECORD;
            delete_sql TEXT := '';
            ptpr_uuids TEXT := '
            ''7666e309-6a06-435c-8046-70fa63f1d310'',
            ''44d10426-a348-4ad6-bd25-9f55e7ef1a62'',
            ''d1bc3a9e-a12b-4863-b922-b3f10c8088c9'',
            ''8b7d1f0e-399e-464c-b0de-a9d230fe5a35''
          ';
        BEGIN
            -- Loop through all the tables that have a foreign key reference to the 'all_masters_list' table
            FOR rec IN
                SELECT
                    tc.constraint_name,
                    tc.table_name AS current_table_name,
                    kcu.column_name,
                    ccu.table_name AS foreign_table_name
                FROM
                    information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu
                        ON tc.constraint_name = kcu.constraint_name
                    JOIN information_schema.constraint_column_usage ccu
                        ON ccu.constraint_name = tc.constraint_name
                WHERE
                    tc.constraint_type = 'FOREIGN KEY'
                    AND ccu.table_name = 'all_masters_list'
            LOOP
                -- Build the delete SQL statement for each table
                delete_sql := delete_sql || 'DELETE FROM "' || rec.current_table_name || '" WHERE "' || rec.column_name || '" IN (' || ptpr_uuids || ');' || E'\n';
            END LOOP;
          
          -- Execute the delete SQL statements
          EXECUTE delete_sql;
          
          -- Delete the corresponding entries from the 'all_masters_list' table
          EXECUTE 'DELETE FROM all_masters_list WHERE id IN (' || ptpr_uuids || ')';
        END;
        $$;
        
        -- Call the procedure to execute the deletions
        CALL delete_ptpr_entries();
        
        -- Drop the procedure after it has been executed
        DROP PROCEDURE delete_ptpr_entries();

        -- Correct the parent_id for "SRCTS Receipt"
        UPDATE all_masters_list 
        SET parent_id = '2cd4c64d-ef44-408f-a133-7c685bdb57b8'
        WHERE id = '380079fb-ab14-443c-8fe0-2a788c210790';
      `;

        let transaction;
        try {
            transaction = await queryInterface.sequelize.transaction();
            await queryInterface.sequelize.query(queryToRun, { transaction });
            await transaction.commit();
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        //
    }
};
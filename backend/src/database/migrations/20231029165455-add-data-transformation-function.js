"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        CREATE OR REPLACE FUNCTION manipulate_table_data(table_name text, columns_to_manipulate text[])
        RETURNS void AS $$
        DECLARE
            column_name text;
            target_data_type text;
            i int;
        BEGIN

            FOR i IN 1..array_length(columns_to_manipulate, 1)
            LOOP

                column_name := split_part(columns_to_manipulate[i], ',', 1);
                target_data_type := split_part(columns_to_manipulate[i], ',', 2);

                target_data_type := REPLACE(target_data_type, '"', '');

                EXECUTE FORMAT(
                    'UPDATE %I SET %I = CASE WHEN %I IS NOT NULL THEN ''{'' || %I || ''}'' ELSE %I END',
                    table_name, column_name, column_name, column_name, column_name
                );
                
                EXECUTE FORMAT(
                    'ALTER TABLE %I ALTER COLUMN %I TYPE %s USING %I::%s',
                    table_name, column_name, target_data_type, column_name, target_data_type
                );
            END LOOP;
        	EXECUTE FORMAT(
                    'ALTER TABLE %I ALTER COLUMN %I TYPE uuid USING %I::uuid',
                    table_name, 'updated_by', 'updated_by'
                );
          
        		EXECUTE FORMAT(
                    'ALTER TABLE %I ALTER COLUMN %I TYPE uuid USING %I::uuid',
                    table_name, 'created_by', 'created_by'
                );
        END;
        $$ LANGUAGE plpgsql;
        `);
    },

    async down(queryInterface, Sequelize) {
        queryInterface.sequelize.query(`
		  DROP FUNCTION IF EXISTS manipulate_table_data;
        `);
    }
};

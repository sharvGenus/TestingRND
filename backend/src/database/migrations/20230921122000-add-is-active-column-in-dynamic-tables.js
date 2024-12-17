"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Create the ENUM type
            await queryInterface.sequelize.query(`
        CREATE TYPE form_response_is_active AS ENUM ('1', '0');
      `);

            // Query to fetch tables that match your criteria
            const [tables] = await queryInterface.sequelize.query(`
        SELECT t.table_name
        FROM information_schema.tables AS t
        LEFT JOIN information_schema.columns AS c
            ON t.table_name = c.table_name
            AND c.column_name = 'is_active'
        WHERE t.table_name LIKE 'zform%'
      `);

            // Extract table names from the result
            const tableNames = tables.map((row) => row.table_name);
            
            // Define an array of Promises to run the ALTER TABLE queries in parallel
            const alterTablePromises = tableNames.map(async (tableName) => queryInterface.sequelize.query(`
            ALTER TABLE ${tableName}
            ADD COLUMN is_active form_response_is_active DEFAULT '1';
          `));

            // Execute all ALTER TABLE queries in parallel
            await Promise.all(alterTablePromises);
        } catch (error) {
            console.error(error);
        }
    },

    down: async (queryInterface, Sequelize) => {
        try {
            // Drop the ENUM type
            await queryInterface.sequelize.query(`
        DROP TYPE IF EXISTS form_responses_is_active;
      `);
        } catch (error) {
            console.error(error);
        }
    }
};

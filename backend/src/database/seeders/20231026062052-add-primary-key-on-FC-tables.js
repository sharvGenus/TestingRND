"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tables = await queryInterface.sequelize.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name LIKE 'zform%'
          AND table_name NOT LIKE '%_history'
        ORDER BY table_name ASC;
        `);
        
        const promises = tables[0].map(async (table) => {
            const tableName = table.table_name;
            const alterQuery = `
                ALTER TABLE "${tableName}"
                ADD PRIMARY KEY ("id");
            `;
            await queryInterface.sequelize.query(alterQuery);
        });

        await Promise.all(promises);
    },

    down: async (queryInterface, Sequelize) => {
        const tables = await queryInterface.sequelize.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name LIKE 'zform%'
          AND table_name NOT LIKE '%_history'
        ORDER BY table_name ASC;
      `);

        const promises = tables[0].map(async (table) => {
            const tableName = table.table_name;
            const alterQuery = `
                ALTER TABLE "${tableName}"
                DROP CONSTRAINT IF EXISTS "${tableName}_pkey";
            `;
            await queryInterface.sequelize.query(alterQuery);
        });

        await Promise.all(promises);
    }
};

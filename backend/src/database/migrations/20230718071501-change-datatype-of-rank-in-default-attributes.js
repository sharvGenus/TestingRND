"use strict";

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(async (transaction) => {
            const combinedQuery = `
                -- Step 1: Add a temporary column with the INTEGER data type
                ALTER TABLE default_attributes ADD COLUMN temp_rank INTEGER;
                
                -- Step 2: Update the temporary column with the current rank values
                UPDATE default_attributes SET temp_rank = CAST(rank AS INTEGER);
                
                -- Step 3: Remove the original rank column
                ALTER TABLE default_attributes DROP COLUMN rank;
                
                
                -- Step 4: Add the new rank column with the INTEGER data type
                ALTER TABLE default_attributes RENAME COLUMN temp_rank to rank;
            `;
            
            await queryInterface.sequelize.query(combinedQuery, { transaction });
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(async (transaction) => {
            const combinedQuery = `
                -- Step 1: Add a temporary column with the STRING data type
                ALTER TABLE default_attributes ADD COLUMN temp_rank VARCHAR;
                
                -- Step 2: Update the temporary column with the current rank values
                UPDATE default_attributes SET temp_rank = CAST(rank AS VARCHAR);
                
                -- Step 3: Remove the original rank column
                ALTER TABLE default_attributes DROP COLUMN rank;
                
                -- Step 4: Add the new rank column with the STRING data type
                ALTER TABLE default_attributes RENAME COLUMN temp_rank to rank;
            `;
            
            await queryInterface.sequelize.query(combinedQuery, { transaction });
        });
    }
};

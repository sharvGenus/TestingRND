"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
			DO $$
			DECLARE
				row record;
				query text;
			BEGIN
				FOR row IN 
					SELECT isc.table_name, isc.column_name 
					FROM information_schema.columns AS isc
					WHERE isc.udt_name='form_responses_is_active'
					GROUP BY isc.table_name, isc.column_name
				LOOP
				-- 	Enable all the triggers
				query := 'ALTER TABLE ' || row.table_name || ' ENABLE TRIGGER ALL';
				EXECUTE query;
				END LOOP;
			END $$;
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

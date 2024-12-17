"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
		    INSERT INTO all_master_columns (id,master_id, name, visible_name, is_active)
            VALUES('aca8818c-ecd2-4615-8a0c-99980c078678', '2bfda55d-d007-4c75-b696-5ee05ef1ec66', 'id', 'Parent ID', '1')
            ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
		`);
    },
    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
            DELETE FROM all_master_columns WHERE id='aca8818c-ecd2-4615-8a0c-99980c078678'
        `);
    }
};
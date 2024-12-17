"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
            UPDATE all_master_columns SET name='id' WHERE id='9400c842-b286-4ff3-8e3c-702bf689ecec';
		`);
    },
    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query("UPDATE all_master_columns SET name='material_type_id' WHERE id='9400c842-b286-4ff3-8e3c-702bf689ecec'");
    }
};
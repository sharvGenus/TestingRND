"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
		UPDATE all_masters_list SET visible_name='Installer to Installer(ITI)' WHERE id='c2dedb42-0bd3-4803-a417-a99bcca4fd97';
		UPDATE all_masters_list SET visible_name='Location to Location(LTL)' WHERE id='0143792a-40ba-4ac8-8d21-3b610b95d4a5';
		UPDATE all_masters_list SET visible_name='Project to Project(PTP)' WHERE id='61849868-c6c8-4469-9352-72ea709f1ab0';
		`);
    },
    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
		UPDATE all_masters_list SET visible_name='Installer to Other Installer(ITI)' WHERE id='c2dedb42-0bd3-4803-a417-a99bcca4fd97';
		UPDATE all_masters_list SET visible_name='Location to Other Location(LTL)' WHERE id='0143792a-40ba-4ac8-8d21-3b610b95d4a5';
		UPDATE all_masters_list SET visible_name='Project to other Project(PTP)' WHERE id='61849868-c6c8-4469-9352-72ea709f1ab0';
        `);
    }
};

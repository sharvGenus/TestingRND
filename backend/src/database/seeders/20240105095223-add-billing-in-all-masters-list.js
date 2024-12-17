"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
		    INSERT INTO all_masters_list (id, parent_id, name, visible_name, master_route, access_flag, rank, is_master) VALUES
			  ('d612a827-d182-4e56-b04d-112e862775b2', '654fb67d-edbc-4d7e-9848-dc41676cfc23', 'bill_submission', 'Bill Submission', '/bill-submission', 'true', '10', false),
	      ('30459b92-5f27-45d6-a3ab-eca18a2c186a', '654fb67d-edbc-4d7e-9848-dc41676cfc23', 'billing_approver_dashboard', 'Billing Approver Dashboard', '/billing-approver-dashboard', 'true', '11', false)
        `);
        // need to add one more for dashboard
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query("DELETE FROM all_masters_list WHERE id IN ('d612a827-d182-4e56-b04d-112e862775b2', '30459b92-5f27-45d6-a3ab-eca18a2c186a')");
    }
};

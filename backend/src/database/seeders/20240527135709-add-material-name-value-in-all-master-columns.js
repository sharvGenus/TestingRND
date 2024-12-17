"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
        	INSERT INTO public.all_master_columns (
          		id, master_id, name, visible_name, is_active) VALUES (
          		'1af33948-9a71-414c-b59f-03fb4813fa8a', 'f3d13141-3cba-489d-9987-5f72a3e345c4', 'name'::character varying, 'Material Name'::character varying, '1'::enum_all_master_columns_is_active)
          	returning id;
            INSERT INTO public.all_master_columns (
                id, master_id, name, visible_name, is_active) VALUES (
                '5b7dbdef-abac-4710-8214-8f3abb501696', 'f3d13141-3cba-489d-9987-5f72a3e345c4', 'id'::character varying, 'Material ID'::character varying, '1'::enum_all_master_columns_is_active)
            returning id;
            INSERT INTO public.all_master_columns (
                id, master_id, name, visible_name, is_active) VALUES (
                '0d3fa265-d395-4a09-9d30-772c6d0ae45a', '4993b4e1-fe3a-4c84-9206-cddb3aee1dae', 'id'::character varying, 'Organization ID'::character varying, '1'::enum_all_master_columns_is_active)
            returning id;
       `);
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};

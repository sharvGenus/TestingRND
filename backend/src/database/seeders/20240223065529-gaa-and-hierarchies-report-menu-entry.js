"use strict";

const { ALL_MASTERS_LIST } = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
          INSERT INTO public.${ALL_MASTERS_LIST} (
            id, 
            name, 
            visible_name, 
            access_flag, 
            parent, 
            grand_parent, 
            parent_rank, 
            grand_parent_rank, 
            is_active, 
            created_by, 
            updated_by, 
            created_at, 
            updated_at, 
            deleted_at, 
            rank, 
            parent_id, 
            grand_parent_id, 
            is_master, 
            lov_access, 
            master_route, 
            table_type
          )
          VALUES (
            '9672f613-ecb7-49b9-b264-135fcc8542f6', 
            NULL,
            'GAA & Network Hierarchy Report', 
            TRUE, 
            NULL, 
            NULL, 
            NULL, 
            NULL, 
            '1', 
            NULL, 
            NULL, 
            '2023-12-21 12:56:40.300438+05:30', 
            '2023-12-21 12:56:40.300438+05:30', 
            NULL, 
            7, 
            '8b682419-3d70-4c52-b229-c82b5559aec8', 
            NULL, 
            FALSE, 
            FALSE, 
            NULL, 
            'table'
          );
    `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
          DELETE FROM public.${ALL_MASTERS_LIST}
          WHERE id = '9672f613-ecb7-49b9-b264-135fcc8542f6';
    `);
    }
};

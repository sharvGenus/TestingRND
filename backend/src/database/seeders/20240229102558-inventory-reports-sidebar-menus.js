"use strict";

const {
    ALL_MASTERS_LIST
} = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            INSERT INTO public.${ALL_MASTERS_LIST}(
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
              table_type)
            VALUES (
              '5ea9135d-7dff-4b1d-bccc-d53756986691',
              NULL, 
              'Supervisor Wise Material Status', 
              TRUE, 
              NULL, 
              NULL, 
              NULL, 
              NULL, 
              '1', 
              NULL, 
              NULL, 
              '2023-09-01 21:43:50.854659+05:30', 
              '2023-09-01 21:43:50.854659+05:30', 
              NULL, 
              7, 
              '8b3c564d-9558-4c24-899f-e22113f15c96', 
              '8b682419-3d70-4c52-b229-c82b5559aec8', 
              FALSE, 
              FALSE, 
              '/supervisor-wise-material-status-report', 
              'table'
            ); 
            INSERT INTO public.${ALL_MASTERS_LIST}(
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
              table_type)
            VALUES (
              '65c4c512-6859-4458-86b3-6c8ea86c2d6d',
              NULL, 
              'Installer Wise Material Status', 
              TRUE, 
              NULL, 
              NULL, 
              NULL, 
              NULL, 
              '1', 
              NULL, 
              NULL, 
              '2023-09-01 21:43:50.854659+05:30', 
              '2023-09-01 21:43:50.854659+05:30', 
              NULL, 
              8, 
              '8b3c564d-9558-4c24-899f-e22113f15c96', 
              '8b682419-3d70-4c52-b229-c82b5559aec8', 
              FALSE, 
              FALSE, 
              '/installer-wise-material-status-report', 
              'table'
            );

            UPDATE public.${ALL_MASTERS_LIST}
            SET VISIBLE_NAME = 'Store Wise Material Summary'
            WHERE ID = '5a5e796b-d7c8-4915-9215-d36e5c079f44';

            UPDATE public.${ALL_MASTERS_LIST}
            SET VISIBLE_NAME = 'Contractor Wise Material Summary'
            WHERE ID = '9844f817-8e0c-49e1-a15d-ca44865ddf74';
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
          DELETE FROM public.${ALL_MASTERS_LIST} WHERE ID IN ('5ea9135d-7dff-4b1d-bccc-d53756986691', '65c4c512-6859-4458-86b3-6c8ea86c2d6d');

          UPDATE public.${ALL_MASTERS_LIST}
          SET VISIBLE_NAME = 'Store Wise Material Summary Report'
          WHERE ID = '5a5e796b-d7c8-4915-9215-d36e5c079f44';

          UPDATE public.${ALL_MASTERS_LIST}
          SET VISIBLE_NAME = 'Contractor Wise Material Summary Report'
          WHERE ID = '9844f817-8e0c-49e1-a15d-ca44865ddf74';
        `);
    }
};

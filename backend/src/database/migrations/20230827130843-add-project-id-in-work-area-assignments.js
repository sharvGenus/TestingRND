"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
          ALTER TABLE work_area_assignment ADD COLUMN project_id uuid;
          ALTER TABLE work_area_assignment_history ADD COLUMN project_id uuid;
          ALTER TABLE work_area_assignment ADD CONSTRAINT work_area_assignment_project_id_fkey 
          FOREIGN KEY (project_id)
          REFERENCES public.projects (id) MATCH SIMPLE
          ON UPDATE NO ACTION
          ON DELETE NO ACTION
      `);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
        ALTER TABLE work_area_assignment DROP CONSTRAINT work_area_assignment_project_id_fkey;
        ALTER TABLE work_area_assignment DROP COLUMN project_id;
        ALTER TABLE work_area_assignment_history DROP COLUMN project_id;
      `);
    }
};

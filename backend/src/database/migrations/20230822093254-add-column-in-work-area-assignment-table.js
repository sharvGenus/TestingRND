"use strict";

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
      ALTER TABLE work_area_assignment ADD COLUMN temp_gaa_level_entry_id uuid;
      ALTER TABLE work_area_assignment_history ADD COLUMN temp_gaa_level_entry_id uuid;
      ALTER TABLE work_area_assignment ADD COLUMN temp_network_level_entry_id uuid;
      ALTER TABLE work_area_assignment_history ADD COLUMN temp_network_level_entry_id uuid;
      UPDATE work_area_assignment SET temp_gaa_level_entry_id=gaa_level_entry_id;
      UPDATE work_area_assignment_history SET temp_gaa_level_entry_id=gaa_level_entry_id;
      UPDATE work_area_assignment SET temp_network_level_entry_id=network_level_entry_id;
      UPDATE work_area_assignment_history SET temp_network_level_entry_id=network_level_entry_id;
      ALTER TABLE work_area_assignment DROP COLUMN gaa_level_entry_id;
      ALTER TABLE work_area_assignment_history DROP COLUMN gaa_level_entry_id;
      ALTER TABLE work_area_assignment DROP COLUMN network_level_entry_id;
      ALTER TABLE work_area_assignment_history DROP COLUMN network_level_entry_id;
      ALTER TABLE work_area_assignment ADD COLUMN gaa_level_entry_id uuid[];
      ALTER TABLE work_area_assignment_history ADD COLUMN gaa_level_entry_id uuid[];
      ALTER TABLE work_area_assignment ADD COLUMN network_level_entry_id uuid[];
      ALTER TABLE work_area_assignment_history ADD COLUMN network_level_entry_id uuid[];
      UPDATE work_area_assignment SET gaa_level_entry_id=  Array[temp_gaa_level_entry_id];
      UPDATE work_area_assignment_history SET gaa_level_entry_id= Array[temp_gaa_level_entry_id];
      UPDATE work_area_assignment SET network_level_entry_id=  Array[network_level_entry_id];
      UPDATE work_area_assignment_history SET network_level_entry_id= Array[network_level_entry_id];
      ALTER TABLE work_area_assignment DROP COLUMN temp_gaa_level_entry_id;
      ALTER TABLE work_area_assignment_history DROP COLUMN temp_gaa_level_entry_id;
      ALTER TABLE work_area_assignment DROP COLUMN temp_network_level_entry_id;
      ALTER TABLE work_area_assignment_history DROP COLUMN temp_network_level_entry_id;
      CREATE TYPE enum AS ENUM ('gaa', 'network');
      ALTER TABLE work_area_assignment
      ADD COLUMN hierarchy_type enum DEFAULT 'gaa';
      ALTER TABLE work_area_assignment_history
      ADD COLUMN hierarchy_type enum DEFAULT 'gaa';
      `);
    },

    down: async function (queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
      ALTER TABLE work_area_assignment DROP COLUMN temp_gaa_level_entry_id uuid;
      ALTER TABLE work_area_assignment_history DROP COLUMN temp_gaa_level_entry_id uuid;
      ALTER TABLE work_area_assignment DROP COLUMN temp_network_level_entry_id uuid;
      ALTER TABLE work_area_assignment_history DROP COLUMN temp_network_level_entry_id uuid;
      ALTER TABLE work_area_assignment DROP COLUMN hierarchy_type;
      ALTER TABLE work_area_assignment_history DROP COLUMN hierarchy_type;
      `);
    }
};

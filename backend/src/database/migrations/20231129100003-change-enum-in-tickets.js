"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
            CREATE TYPE new_enum_type as ENUM ('role', 'organization');
            ALTER TABLE tickets
            ALTER COLUMN assign_by TYPE new_enum_type
            USING assign_by::text::new_enum_type;
            ALTER TABLE tickets_history
            ALTER COLUMN assign_by TYPE new_enum_type
            USING assign_by::text::new_enum_type;
            DROP TYPE enum_tickets_assign_by;
            CREATE TYPE enum_tickets_assign_by as ENUM ('role', 'organization', 'gaa');
            ALTER TABLE tickets
            ALTER COLUMN assign_by TYPE enum_tickets_assign_by
            USING assign_by::text::enum_tickets_assign_by;
            ALTER TABLE tickets_history
            ALTER COLUMN assign_by TYPE enum_tickets_assign_by
            USING assign_by::text::enum_tickets_assign_by;
            DROP TYPE new_enum_type;

            ALTER TABLE tickets
            ALTER COLUMN assign_by SET DEFAULT 'gaa',
            ALTER COLUMN assignee_type SET DEFAULT 'nomc';
            ALTER TABLE tickets_history
            ALTER COLUMN assign_by SET DEFAULT 'gaa',
            ALTER COLUMN assignee_type SET DEFAULT 'nomc';
          `);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
          CREATE TYPE new_enum_type as ENUM ('role', 'organization', 'gaa');
          ALTER TABLE tickets
          ALTER COLUMN assign_by TYPE new_enum_type
          USING assign_by::text::new_enum_type;
          ALTER TABLE tickets_history
          ALTER COLUMN assign_by TYPE new_enum_type
          USING assign_by::text::new_enum_type;
          DROP TYPE enum_tickets_assign_by;
          CREATE TYPE enum_tickets_assign_by as ENUM ('role', 'organization');
          ALTER TABLE tickets
          ALTER COLUMN assign_by TYPE enum_tickets_assign_by
          USING assign_by::text::enum_tickets_assign_by;
          ALTER TABLE tickets_history
          ALTER COLUMN assign_by TYPE enum_tickets_assign_by
          USING assign_by::text::enum_tickets_assign_by;
          DROP TYPE new_enum_type;
          ALTER TABLE tickets
          ALTER COLUMN assign_by DROP DEFAULT,
          ALTER COLUMN assignee_type DROP DEFAULT;
          ALTER TABLE tickets_history
          ALTER COLUMN assign_by DROP DEFAULT,
          ALTER COLUMN assignee_type DROP DEFAULT;
          `);
    }
};

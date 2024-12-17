"use strict";

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        ALTER TABLE users DROP COLUMN date_of_onboarding;
        ALTER TABLE users ADD COLUMN date_of_onboarding timestamptz;
        ALTER TABLE users_history DROP COLUMN date_of_onboarding;
        ALTER TABLE users_history ADD COLUMN date_of_onboarding timestamptz;
      `);
    },

    down: async function (queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        ALTER TABLE users DROP COLUMN date_of_onboarding;
        ALTER TABLE users ADD COLUMN date_of_onboarding varchar;
        ALTER TABLE users_history DROP COLUMN date_of_onboarding;
        ALTER TABLE users_history ADD COLUMN date_of_onboarding varchar;
      `);
    }
};

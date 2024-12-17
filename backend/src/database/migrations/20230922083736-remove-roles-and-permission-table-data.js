"use strict";

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        delete from user_column_wise_permissions;
        delete from user_column_default_permissions;
        update users set role_id = null where id <> '577b8900-b333-42d0-b7fb-347abc3f0b5c';
      `);
    },

    down: async function (queryInterface, Sequelize) {
        return Promise.resolve();
    }
};
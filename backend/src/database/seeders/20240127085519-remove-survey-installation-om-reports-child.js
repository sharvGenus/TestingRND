"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
      return queryInterface.sequelize.query(`
        DELETE FROM user_master_permissions
        WHERE master_id IN (SELECT id FROM all_masters_list WHERE parent_id IN ('f573934c-5227-4835-a553-cfabb0bb871a', '04ca030a-01ff-436c-8626-a1a3632ec760', '2e774501-3f6b-4e3f-91a2-2000e81368b2'));
        
        DELETE FROM role_master_permissions
        WHERE master_id IN (SELECT id FROM all_masters_list WHERE parent_id IN ('f573934c-5227-4835-a553-cfabb0bb871a', '04ca030a-01ff-436c-8626-a1a3632ec760', '2e774501-3f6b-4e3f-91a2-2000e81368b2'));
        
        DELETE FROM all_masters_list
        WHERE parent_id IN ('f573934c-5227-4835-a553-cfabb0bb871a', '04ca030a-01ff-436c-8626-a1a3632ec760', '2e774501-3f6b-4e3f-91a2-2000e81368b2');
      `);
    },

    async down(queryInterface, Sequelize) {},
};

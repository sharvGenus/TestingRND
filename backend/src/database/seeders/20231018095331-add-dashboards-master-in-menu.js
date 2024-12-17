"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            "insert into all_masters_list (id,visible_name, access_flag, master_route)  values ('80f348ff-2cf9-46aa-87d7-c33e47e00485','Dashboards', 'true', '/reports-dashboard')"
        );
    }
};
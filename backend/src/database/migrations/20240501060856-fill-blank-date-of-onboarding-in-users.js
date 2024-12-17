"use strict";

const config = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`UPDATE ${config.USERS} 
        SET date_of_onboarding = DATE(created_at)
        WHERE name NOT IN ('Mr.Inventory','Mr. Admin') AND date_of_onboarding IS NULL`);
    }
};

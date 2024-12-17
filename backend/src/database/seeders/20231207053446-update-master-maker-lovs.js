"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("master_maker_lovs", [
            {
                id: "799ee00c-0819-498a-9e47-3ac269f33db8",
                master_id: "96a70303-09f6-4eb4-a20d-af37ebedaff8",
                name: "ITC",
                is_active: "1",
                created_at: "2023-12-07 19:47:07.074309+05:30",
                updated_at: "2023-12-07 19:47:07.074309+05:30"
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.bulkDelete("master_maker_lovs", { id: ["799ee00c-0819-498a-9e47-3ac269f33db8"] })
        ]);
    }
    
};

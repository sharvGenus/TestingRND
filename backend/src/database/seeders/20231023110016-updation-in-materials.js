"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Use Promise.all for independent queries
        await queryInterface.bulkInsert("materials", [
            {
                id: "84b473e1-62bb-4afe-af56-1691bdffbc55",
                material_type_id: "b3e0bfd7-2eff-4ac9-8ae8-6c5dcbfb34aa",
                name: "Old Meter",
                code: "OLDMETER1",
                description: "Old Meter",
                uom_id: "7a1cf361-7fa3-4ca2-88ea-ee3212818d14",
                hsn_code: "OLDMETER",
                is_serial_number: true,
                is_active: "1",
                created_at: "2023-10-23 16:47:07.074309+05:30",
                updated_at: "2023-10-23 16:47:07.074309+05:30"
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        // Revert the changes made in the 'up' function
        await Promise.all([
            queryInterface.bulkDelete("materials", {
                id: [
                    "84b473e1-62bb-4afe-af56-1691bdffbc55"
                ]
            })
        ]);
    }
    
};

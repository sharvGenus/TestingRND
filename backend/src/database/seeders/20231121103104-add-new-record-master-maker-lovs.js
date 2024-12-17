"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("master_maker_lovs", [
            // columns for global master maker lov
            {
                id: "923fa9a0-5ed5-4bc2-9946-dad0da5f34c4",
                master_id: "96a70303-09f6-4eb4-a20d-af37ebedaff8",
                name: "CANCELINSTALLED",
                is_active: "1",
                created_at: "2023-06-30 19:47:07.074309+05:30",
                updated_at: "2023-06-30 19:47:07.074309+05:30"

            },
            {
                id: "79f09003-a389-4a81-abd8-43b77a5f914b",
                master_id: "96a70303-09f6-4eb4-a20d-af37ebedaff8",
                name: "CANCELOLDMETER",
                is_active: "1",
                created_at: "2023-06-30 19:47:07.074309+05:30",
                updated_at: "2023-06-30 19:47:07.074309+05:30"
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        // Revert the changes made in the 'up' function
        await queryInterface.bulkDelete("master_maker_lovs", {
            id: [
                "79f09003-a389-4a81-abd8-43b77a5f914b",
                "923fa9a0-5ed5-4bc2-9946-dad0da5f34c4"
            ]
        });
     
    }
    
};

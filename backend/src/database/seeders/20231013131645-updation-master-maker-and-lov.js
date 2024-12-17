"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Use Promise.all for independent queries
        await queryInterface.bulkInsert("master_makers", [
            {
                id: "80345a0d-1e9e-4b62-8f45-9c3bb364fa7b",
                name: "BRAND CONFIGURATOR",
                is_active: "1",
                created_at: "2023-06-30 19:47:07.074309+05:30",
                updated_at: "2023-06-30 19:47:07.074309+05:30"
            }
        ]);
        
        await queryInterface.bulkInsert("master_maker_lovs", [
            // columns for global master maker lov
            {
                id: "203e3193-7e6b-41db-a30d-9cc6505f73fd",
                master_id: "80345a0d-1e9e-4b62-8f45-9c3bb364fa7b",
                name: "GENUS",
                is_active: "1",
                created_at: "2023-06-30 19:47:07.074309+05:30",
                updated_at: "2023-06-30 19:47:07.074309+05:30"
            },
            {
                id: "f3848838-6e7c-4240-a4e2-27e084164a17",
                master_id: "96a70303-09f6-4eb4-a20d-af37ebedaff8",
                name: "INSTALLED",
                is_active: "1",
                created_at: "2023-06-30 19:47:07.074309+05:30",
                updated_at: "2023-06-30 19:47:07.074309+05:30"

            },
            {
                id: "cb92ec5a-3f86-48cf-86b8-9359dda410a5",
                master_id: "96a70303-09f6-4eb4-a20d-af37ebedaff8",
                name: "OLDMETER",
                is_active: "1",
                created_at: "2023-06-30 19:47:07.074309+05:30",
                updated_at: "2023-06-30 19:47:07.074309+05:30"
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        // Revert the changes made in the 'up' function
        await Promise.all([
            queryInterface.bulkDelete("master_makers", {
                id: [
                    "80345a0d-1e9e-4b62-8f45-9c3bb364fa7b"
                ]
            }),
            queryInterface.bulkDelete("master_maker_lovs", {
                id: [
                    "cb92ec5a-3f86-48cf-86b8-9359dda410a5",
                    "f3848838-6e7c-4240-a4e2-27e084164a17",
                    "203e3193-7e6b-41db-a30d-9cc6505f73fd"
                ]
            })
        ]);
    }
    
};

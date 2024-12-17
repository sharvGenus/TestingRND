"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Use Promise.all for independent queries
  
        await queryInterface.bulkInsert("master_maker_lovs", [
            // columns for global master maker lov
            {
                id: "86f7e47f-195a-4cbd-87a4-1f5a3e97025f",
                master_id: "96a70303-09f6-4eb4-a20d-af37ebedaff8",
                name: "CTS",
                is_active: "1",
                created_at: "2023-10-31 19:47:07.074309+05:30",
                updated_at: "2023-10-31 19:47:07.074309+05:30"
            },
            {
                id: "353e2cb7-98d9-4248-b7c1-e8fe40b35358",
                master_id: "96a70303-09f6-4eb4-a20d-af37ebedaff8",
                name: "CANCELCTS",
                is_active: "1",
                created_at: "2023-10-31 19:47:07.074309+05:30",
                updated_at: "2023-10-31 19:47:07.074309+05:30"

            },
            {
                id: "671306a0-48c5-4e0c-a604-d86624f35d6d",
                master_id: "96a70303-09f6-4eb4-a20d-af37ebedaff8",
                name: "CONSUMPTIONREQUEST",
                is_active: "1",
                created_at: "2023-10-31 19:47:07.074309+05:30",
                updated_at: "2023-10-31 19:47:07.074309+05:30"
            },
            {
                id: "c6ba6e0d-9657-41ee-a514-3d5ec766a822",
                master_id: "96a70303-09f6-4eb4-a20d-af37ebedaff8",
                name: "CANCELCONSUMPTIONREQUEST",
                is_active: "1",
                created_at: "2023-10-31 19:47:07.074309+05:30",
                updated_at: "2023-10-31 19:47:07.074309+05:30"
            },
            {
                id: "ef599c14-9e23-447d-9f35-336d69fdfe74",
                master_id: "96a70303-09f6-4eb4-a20d-af37ebedaff8",
                name: "CONSUMPTION",
                is_active: "1",
                created_at: "2023-10-31 19:47:07.074309+05:30",
                updated_at: "2023-10-31 19:47:07.074309+05:30"
            },
            {
                id: "845b0a9d-b6be-4248-b60f-24180c46b406",
                master_id: "96a70303-09f6-4eb4-a20d-af37ebedaff8",
                name: "CANCELCONSUMPTION",
                is_active: "1",
                created_at: "2023-10-31 19:47:07.074309+05:30",
                updated_at: "2023-10-31 19:47:07.074309+05:30"
            }
        ]);
        await queryInterface.bulkDelete("master_maker_lovs", {
            id: [
                "203e3193-7e6b-41db-a30d-9cc6505f73fd",
                "ec6d039b-9286-4e13-8f9f-092b12e75808"
            ]
        });
        await queryInterface.bulkDelete("master_makers", { id: ["80345a0d-1e9e-4b62-8f45-9c3bb364fa7b"] });
        
    },

    async down(queryInterface, Sequelize) {
        // Revert the changes made in the 'up' function
        await queryInterface.bulkDelete("master_maker_lovs", {
            id: [
                "86f7e47f-195a-4cbd-87a4-1f5a3e97025f",
                "353e2cb7-98d9-4248-b7c1-e8fe40b35358",
                "671306a0-48c5-4e0c-a604-d86624f35d6d",
                "c6ba6e0d-9657-41ee-a514-3d5ec766a822",
                "ef599c14-9e23-447d-9f35-336d69fdfe74",
                "845b0a9d-b6be-4248-b60f-24180c46b406"
            ]
        });
     
    }
    
};

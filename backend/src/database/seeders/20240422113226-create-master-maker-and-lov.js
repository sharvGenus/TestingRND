"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("master_makers", [
            {
                id: "0a369b95-10fb-40f7-b60a-d0c117c0f4c5",
                name: "USER-STATUS",
                is_active: "1",
                created_at: "2024-04-18 19:47:07.074309+05:30",
                updated_at: "2024-04-18 19:47:07.074309+05:30"
            }
        ]);

        await queryInterface.bulkInsert("master_maker_lovs", [
            {
                id: "de6ae8b5-909a-4ea4-a518-bfad9bdbdd3d",
                master_id: "0a369b95-10fb-40f7-b60a-d0c117c0f4c5",
                name: "Create",
                is_active: "1",
                created_at: "2024-04-18 19:47:07.074309+05:30",
                updated_at: "2024-04-18 19:47:07.074309+05:30"
            },
            {
                id: "5ba80e90-6e3d-4a22-873f-9a10908d5a06",
                master_id: "0a369b95-10fb-40f7-b60a-d0c117c0f4c5",
                name: "Update",
                is_active: "1",
                created_at: "2024-04-18 19:47:07.074309+05:30",
                updated_at: "2024-04-18 19:47:07.074309+05:30"

            },
            {
                id: "c15f716f-5fc7-422c-8ac2-74c688dce2d1",
                master_id: "0a369b95-10fb-40f7-b60a-d0c117c0f4c5",
                name: "Delete",
                is_active: "1",
                created_at: "2024-04-18 19:47:07.074309+05:30",
                updated_at: "2024-04-18 19:47:07.074309+05:30"
            },
            {
                id: "8e92b381-56ab-4191-af00-12f3c59c09bf",
                master_id: "0a369b95-10fb-40f7-b60a-d0c117c0f4c5",
                name: "Restore",
                is_active: "1",
                created_at: "2024-04-18 19:47:07.074309+05:30",
                updated_at: "2024-04-18 19:47:07.074309+05:30"
            },
            {
                id: "40e66f7e-4088-4bd1-a555-c5b867b101c9",
                master_id: "0a369b95-10fb-40f7-b60a-d0c117c0f4c5",
                name: "AutoDelete",
                is_active: "1",
                created_at: "2024-04-18 19:47:07.074309+05:30",
                updated_at: "2024-04-18 19:47:07.074309+05:30"
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        const ids = [
            "40e66f7e-4088-4bd1-a555-c5b867b101c9",
            "8e92b381-56ab-4191-af00-12f3c59c09bc",
            "c15f716f-5fc7-422c-8ac2-74c688dce2d1",
            "5ba80e90-6e3d-4a22-873f-9a10908d5a06",
            "de6ae8b5-909a-4ea4-a518-bfad9bdbdd3d"];

        await Promise.all([
            queryInterface.bulkDelete("master_makers", { id: "0a369b95-10fb-40f7-b60a-d0c117c0f4c5" }),
            queryInterface.bulkDelete("master_maker_lovs", { id: ids })
        ]);
    }
};
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("master_maker_lovs", [
            {
                id: "cf9510a5-42a4-4931-8a40-a4876c8a49e5",
                master_id: "0a369b95-10fb-40f7-b60a-d0c117c0f4c5",
                name: "Locked",
                is_active: "1",
                created_at: "2024-04-18 19:47:07.074309+05:30",
                updated_at: "2024-04-18 19:47:07.074309+05:30"
            },
            {
                id: "2cce2d81-018c-4024-a54f-438600cd5513",
                master_id: "0a369b95-10fb-40f7-b60a-d0c117c0f4c5",
                name: "Unlocked",
                is_active: "1",
                created_at: "2024-04-18 19:47:07.074309+05:30",
                updated_at: "2024-04-18 19:47:07.074309+05:30"
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        const ids = [
            "2cce2d81-018c-4024-a54f-438600cd5513",
            "cf9510a5-42a4-4931-8a40-a4876c8a49e5"
        ];

        await queryInterface.bulkDelete("master_maker_lovs", { id: ids });
    }
};
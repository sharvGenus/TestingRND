"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("master_maker_lovs", [
            {
                id: "08b2b727-a55b-467a-889a-1974ed19bb94",
                master_id: "0eba82dc-29af-4694-b943-af7d86fc686f",
                name: "Safety"
            },
            {
                id: "4002759e-b2f4-4017-90de-4a8feb7b509e",
                master_id: "0eba82dc-29af-4694-b943-af7d86fc686f",
                name: "Tools"
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("master_maker_lovs", {
            id: [
                "08b2b727-a55b-467a-889a-1974ed19bb94",
                "4002759e-b2f4-4017-90de-4a8feb7b509e"
            ]
        });
     
    }
    
};

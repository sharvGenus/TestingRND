"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("master_maker_lovs", [
            {
                id: "373e2aeb-a62c-4855-bba3-daacf025458f",
                master_id: "96a70303-09f6-4eb4-a20d-af37ebedaff8",
                name: "CANCELSTSRC"
            },
            {
                id: "2d807559-c937-483d-aa22-24cc1faf8829",
                master_id: "96a70303-09f6-4eb4-a20d-af37ebedaff8",
                name: "CANCELSRCTS"
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("master_maker_lovs", {
            id: [
                "373e2aeb-a62c-4855-bba3-daacf025458f",
                "2d807559-c937-483d-aa22-24cc1faf8829"
            ]
        });
     
    }
    
};

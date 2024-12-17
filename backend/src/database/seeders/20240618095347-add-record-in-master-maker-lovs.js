"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("master_maker_lovs", [
            {
                id: "c384a987-d92c-481f-9223-605dd3d05338",
                master_id: "96a70303-09f6-4eb4-a20d-af37ebedaff8",
                name: "PTPGRN"
            },
            {
                id: "73df529f-9008-4917-ab2b-088b9222fa68",
                master_id: "96a70303-09f6-4eb4-a20d-af37ebedaff8",
                name: "CANCELPTPGRN"
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("master_maker_lovs", {
            id: [
                "c384a987-d92c-481f-9223-605dd3d05338",
                "73df529f-9008-4917-ab2b-088b9222fa68"
            ]
        });
     
    }
    
};

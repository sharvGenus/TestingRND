"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("all_masters_list", [
            {
                id: "02cc1fdc-0c8b-4cf9-9977-34fed65601e7",
                name: "serialize_material_type",
                visible_name: "Serialize Material Type",
                is_master: true,
                access_flag: true,
                table_type: "function"
            }
        ]);

        await Promise.all([
            queryInterface.bulkInsert("all_master_columns", [
                {
                    id: "9400c842-b286-4ff3-8e3c-702bf689ecec",
                    master_id: "02cc1fdc-0c8b-4cf9-9977-34fed65601e7",
                    name: "material_type_id",
                    visible_name: "Material Type ID"
                },
                {
                    id: "74821e0c-cab8-4f10-a81d-be8f2a059627",
                    master_id: "02cc1fdc-0c8b-4cf9-9977-34fed65601e7",
                    name: "serial_number",
                    visible_name: "Serial Number"
                }
            ])
        ]);
    },

    async down(queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.bulkDelete("all_master_columns", {
                id: [
                    "9400c842-b286-4ff3-8e3c-702bf689ecec",
                    "74821e0c-cab8-4f10-a81d-be8f2a059627"
                ]
            }),
            queryInterface.sequelize.query("delete from all_masters_list where id = '02cc1fdc-0c8b-4cf9-9977-34fed65601e7")
        ]);
    }
    
};

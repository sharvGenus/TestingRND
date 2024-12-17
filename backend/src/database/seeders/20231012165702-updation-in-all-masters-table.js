"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Use Promise.all for independent queries
        await queryInterface.addColumn("all_masters_list", "table_type", {
            type: Sequelize.STRING,
            defaultValue: "table"
        });

        await queryInterface.addColumn("all_masters_list_history", "table_type", {
            type: Sequelize.STRING,
            defaultValue: "table"
        });
        await queryInterface.bulkInsert("all_masters_list", [
            {
                id: "2bfda55d-d007-4c75-b696-5ee05ef1ec66",
                name: "serial_numbers",
                visible_name: "Serialize Material",
                is_master: true,
                access_flag: true,
                table_type: "function"
            },
            {
                id: "63dfdba2-8bbc-40ea-a934-f38e44d0d2ca",
                name: "nonserialize_materials",
                visible_name: "Non Serialize Material",
                is_master: true,
                access_flag: true,
                table_type: "function"
            }
        ]);

        await queryInterface.sequelize.query("delete from all_master_columns where master_id = 'c6fb87f4-b45d-4ba8-b7a8-a87ec4953412'");

        await Promise.all([
            queryInterface.sequelize.query("update all_masters_list set is_master = true where id = '3a094270-e052-41f1-821a-236442b98303'"),
            queryInterface.sequelize.query("update all_masters_list set is_master = true where id = '553e753f-1bce-476e-939f-1fd98d9daafd'"),

            queryInterface.bulkInsert("all_master_columns", [
                // columns for global master maker lov
                {
                    id: "be91d676-9aff-4890-827f-7ba886bf04d8",
                    master_id: "553e753f-1bce-476e-939f-1fd98d9daafd",
                    name: "id",
                    visible_name: "Lov ID"
                },
                {
                    id: "29ea6177-c9ea-4449-9691-eff82800f7bf",
                    master_id: "553e753f-1bce-476e-939f-1fd98d9daafd",
                    name: "master_id",
                    visible_name: "Master ID"
                },
                {
                    id: "eb84241e-35bb-4b5a-948d-6b8ce55b5c24",
                    master_id: "553e753f-1bce-476e-939f-1fd98d9daafd",
                    name: "name",
                    visible_name: "LOV Name"
                },
                // columns for globa master maker lov
                {
                    id: "95622402-6212-4e80-8bb2-63589bc014e9",
                    master_id: "3a094270-e052-41f1-821a-236442b98303",
                    name: "name",
                    visible_name: "Master Name"
                },
                {
                    id: "1d61f0d9-ce90-47dd-a469-d428b11fcb1d",
                    master_id: "3a094270-e052-41f1-821a-236442b98303",
                    name: "id",
                    visible_name: "Master ID"
                },
                // serialise material
                {
                    id: "11411549-19df-48e2-8073-bdeb064e99d4",
                    master_id: "2bfda55d-d007-4c75-b696-5ee05ef1ec66",
                    name: "material_id",
                    visible_name: "Material ID"
                },
                {
                    id: "11bfad18-e3df-42b4-b2b5-295b245ac85b",
                    master_id: "2bfda55d-d007-4c75-b696-5ee05ef1ec66",
                    name: "serial_number",
                    visible_name: "Serial Number"
                },
                // non serialise material
                {
                    id: "7b5702ea-18ec-4978-ba73-533f86e34385",
                    master_id: "63dfdba2-8bbc-40ea-a934-f38e44d0d2ca",
                    name: "name",
                    visible_name: "Material Name"
                },
                {
                    id: "76b9212d-e5b3-4947-bf6c-91af8452c059",
                    master_id: "63dfdba2-8bbc-40ea-a934-f38e44d0d2ca",
                    name: "code",
                    visible_name: "Material Code"
                }
            ]),
            queryInterface.sequelize.query("update all_masters_list set visible_name = 'Material Transaction Report' where visible_name = 'Delivery Challan Report'"),
            queryInterface.sequelize.query("update all_masters_list set visible_name = 'Reconciliation Report' where visible_name = 'Contractor Reconciliation Report'"),

            queryInterface.sequelize.query("delete from all_masters_list where id = 'c6fb87f4-b45d-4ba8-b7a8-a87ec4953412'")
        ]);
    },

    async down(queryInterface, Sequelize) {
        // Revert the changes made in the 'up' function
        await Promise.all([
            queryInterface.sequelize.query("update all_masters_list set is_master = false where id = '3a094270-e052-41f1-821a-236442b98303'"),
            queryInterface.sequelize.query("update all_masters_list set is_master = false where id = '553e753f-1bce-476e-939f-1fd98d9daafd'"),
            queryInterface.bulkDelete("all_master_columns", {
                id: [
                    "be91d676-9aff-4890-827f-7ba886bf04d8",
                    "29ea6177-c9ea-4449-9691-eff82800f7bf",
                    "eb84241e-35bb-4b5a-948d-6b8ce55b5c24",
                    "95622402-6212-4e80-8bb2-63589bc014e9",
                    "1d61f0d9-ce90-47dd-a469-d428b11fcb1d",
                    "11411549-19df-48e2-8073-bdeb064e99d4",
                    "11bfad18-e3df-42b4-b2b5-295b245ac85b",
                    "7b5702ea-18ec-4978-ba73-533f86e34385",
                    "76b9212d-e5b3-4947-bf6c-91af8452c059"
                ]
            }),
            queryInterface.sequelize.query("update all_masters_list set visible_name = 'Delivery Challan Report' where visible_name = 'Material Transaction Report'"),
            queryInterface.sequelize.query("update all_masters_list set visible_name = 'Contractor Reconciliation Report' where visible_name = 'Reconciliation Report'"),
            
            // Delete the added rows in all_masters_list
            queryInterface.sequelize.query("delete from all_masters_list where id = '2bfda55d-d007-4c75-b696-5ee05ef1ec66'"),
            queryInterface.sequelize.query("delete from all_masters_list where id = '63dfdba2-8bbc-40ea-a934-f38e44d0d2ca"),
            
            // Remove the newly added columns
            queryInterface.removeColumn("all_masters_list", "table_type"),
            queryInterface.removeColumn("all_masters_list_history", "table_type")
        ]);
    }
    
};

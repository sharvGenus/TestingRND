"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("master_makers", [
            {
                id: "0eba82dc-29af-4694-b943-af7d86fc686f",
                name: "QA METER TYPE"
            },
            {
                id: "4a219c23-9458-410f-a56e-85d7eb7dc4fe",
                name: "OBSERVATION TYPE"
            },
            {
                id: "0d6f899e-443d-46d6-a855-d609da7d2bd8",
                name: "OBSERVATION SEVERITY"
            }
        ]);
        
        await queryInterface.bulkInsert("master_maker_lovs", [
            {
                id: "080000d8-9337-4f5a-b60a-4b3ceb7cd6d5",
                master_id: "861bfe8c-d3d6-4705-b6cc-5982634091a5",
                name: "QA"
            },
            {
                id: "0e20dbad-6201-4cd2-920a-ce7d4def24a6",
                master_id: "0eba82dc-29af-4694-b943-af7d86fc686f",
                name: "1 Phase"
            },
            {
                id: "1d780bc3-e622-4ca5-a613-29c69d03cae7",
                master_id: "0eba82dc-29af-4694-b943-af7d86fc686f",
                name: "3 Phase"
            },
            {
                id: "b4ab478a-2239-42eb-a0fe-2108ef9a88ac",
                master_id: "0eba82dc-29af-4694-b943-af7d86fc686f",
                name: "DT Meter"
            },
            {
                id: "45a1f0ed-158d-4606-ab73-8fb897c28696",
                master_id: "0eba82dc-29af-4694-b943-af7d86fc686f",
                name: "HTCT Boundary Meter"
            },
            {
                id: "c5c1aaa5-5ebc-4b2a-bdb8-312cc9e49626",
                master_id: "0eba82dc-29af-4694-b943-af7d86fc686f",
                name: "HTCT Consumer"
            },
            {
                id: "e4a34ebc-88e7-4a7e-b052-59b4ce29173d",
                master_id: "0eba82dc-29af-4694-b943-af7d86fc686f",
                name: "HTCT Feeder Meter"
            },
            {
                id: "0280ff01-5285-40b9-9253-6fcdea84b4f2",
                master_id: "0eba82dc-29af-4694-b943-af7d86fc686f",
                name: "LTCT Consumer"
            },
            {
                id: "aee25924-19cf-4bc9-b710-4c8928edae2c",
                master_id: "4a219c23-9458-410f-a56e-85d7eb7dc4fe",
                name: "Defect"
            },
            {
                id: "3c10f919-de9a-48d9-a0da-9b8e7ecba500",
                master_id: "4a219c23-9458-410f-a56e-85d7eb7dc4fe",
                name: "Safety"
            },
            {
                id: "efd71833-357d-441d-8a0a-94bc9996ef7a",
                master_id: "0d6f899e-443d-46d6-a855-d609da7d2bd8",
                name: "Critical"
            },
            {
                id: "c88edc70-9655-4c47-b79b-925e97314f94",
                master_id: "0d6f899e-443d-46d6-a855-d609da7d2bd8",
                name: "Critical_Discom"
            },
            {
                id: "5a887759-eceb-4eb3-ae25-c1b728e1adb5",
                master_id: "0d6f899e-443d-46d6-a855-d609da7d2bd8",
                name: "Critical_Product"
            },
            {
                id: "bf889009-b35e-40e8-8b61-8d4fa29dc2ef",
                master_id: "0d6f899e-443d-46d6-a855-d609da7d2bd8",
                name: "Discom"
            },
            {
                id: "df1ca2e4-e96d-457b-a5cc-78045c2cfa0e",
                master_id: "0d6f899e-443d-46d6-a855-d609da7d2bd8",
                name: "Major"
            },
            {
                id: "26a83313-8df5-4b52-80fb-1d3d26fdc3f9",
                master_id: "0d6f899e-443d-46d6-a855-d609da7d2bd8",
                name: "Minor"
            },
            {
                id: "414a019f-5064-47f0-ab8f-8c42dede7c45",
                master_id: "0d6f899e-443d-46d6-a855-d609da7d2bd8",
                name: "No Observation"
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.bulkDelete("master_makers", { id: [
                "0eba82dc-29af-4694-b943-af7d86fc686f",
                "4a219c23-9458-410f-a56e-85d7eb7dc4fe",
                "0d6f899e-443d-46d6-a855-d609da7d2bd8"
            ] }),
            queryInterface.bulkDelete("master_maker_lovs", { id: [
                "080000d8-9337-4f5a-b60a-4b3ceb7cd6d5",
                "0e20dbad-6201-4cd2-920a-ce7d4def24a6",
                "1d780bc3-e622-4ca5-a613-29c69d03cae7",
                "b4ab478a-2239-42eb-a0fe-2108ef9a88ac",
                "45a1f0ed-158d-4606-ab73-8fb897c28696",
                "c5c1aaa5-5ebc-4b2a-bdb8-312cc9e49626",
                "e4a34ebc-88e7-4a7e-b052-59b4ce29173d",
                "0280ff01-5285-40b9-9253-6fcdea84b4f2",
                "aee25924-19cf-4bc9-b710-4c8928edae2c",
                "3c10f919-de9a-48d9-a0da-9b8e7ecba500",
                "efd71833-357d-441d-8a0a-94bc9996ef7a",
                "c88edc70-9655-4c47-b79b-925e97314f94",
                "5a887759-eceb-4eb3-ae25-c1b728e1adb5",
                "bf889009-b35e-40e8-8b61-8d4fa29dc2ef",
                "df1ca2e4-e96d-457b-a5cc-78045c2cfa0e",
                "26a83313-8df5-4b52-80fb-1d3d26fdc3f9",
                "414a019f-5064-47f0-ab8f-8c42dede7c45"
            ] })
        ]);
    }
};
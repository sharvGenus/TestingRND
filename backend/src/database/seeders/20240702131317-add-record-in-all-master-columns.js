"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("all_master_columns", [
            {
                id: "09282f60-5ed3-4a34-8768-fac57ce8d240",
                master_id: "8109792c-c6f6-4b54-9e84-fff897900149",
                name: "id",
                visible_name: "Master ID"
            },
            {
                id: "b456d348-4c30-429f-b999-73ccbbd630fe",
                master_id: "8109792c-c6f6-4b54-9e84-fff897900149",
                name: "project_id",
                visible_name: "Project ID"
            },
            {
                id: "294ae2f6-fdd6-4886-bc8a-6d4c67358744",
                master_id: "8109792c-c6f6-4b54-9e84-fff897900149",
                name: "meter_type_id",
                visible_name: "Meter Type ID"
            },
            {
                id: "b4ea9335-fafa-4adc-8479-d60d29b16dc4",
                master_id: "8109792c-c6f6-4b54-9e84-fff897900149",
                name: "name",
                visible_name: "Master Name"
            },
            {
                id: "8e64a78e-8183-4d1d-8552-800022acde5f",
                master_id: "44d5b2b0-ec81-4ee6-acc2-0cfad4c703a2",
                name: "master_id",
                visible_name: "Master ID"
            },
            {
                id: "2b40d6b3-8009-49de-9277-2a6e39cb1397",
                master_id: "44d5b2b0-ec81-4ee6-acc2-0cfad4c703a2",
                name: "id",
                visible_name: "LOV ID"
            },
            {
                id: "9d30bfc7-ff0b-4d7a-9e8f-6e58fa21d849",
                master_id: "44d5b2b0-ec81-4ee6-acc2-0cfad4c703a2",
                name: "major_contributor",
                visible_name: "Major Contributor"
            },
            {
                id: "cbb9584d-9fc6-46e0-95c2-a061f491705d",
                master_id: "44d5b2b0-ec81-4ee6-acc2-0cfad4c703a2",
                name: "code",
                visible_name: "LOV Code"
            },
            {
                id: "50757854-92b9-450f-b0e9-e360980e72f2",
                master_id: "44d5b2b0-ec81-4ee6-acc2-0cfad4c703a2",
                name: "priority",
                visible_name: "Priority"
            },
            {
                id: "0602328e-288a-4e46-931f-c2a83594f5e7",
                master_id: "44d5b2b0-ec81-4ee6-acc2-0cfad4c703a2",
                name: "defect",
                visible_name: "Defect"
            },
            {
                id: "31dae2a7-2266-41f3-b212-7d34ef46d5c9",
                master_id: "44d5b2b0-ec81-4ee6-acc2-0cfad4c703a2",
                name: "observation_type_id",
                visible_name: "Observation Type ID"
            },
            {
                id: "48cf67e7-8561-40b2-8a17-7ff6df120c91",
                master_id: "44d5b2b0-ec81-4ee6-acc2-0cfad4c703a2",
                name: "observation_severity_id",
                visible_name: "Observation Severity ID"
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.bulkDelete("all_master_columns", { id: [
                "09282f60-5ed3-4a34-8768-fac57ce8d240",
                "b456d348-4c30-429f-b999-73ccbbd630fe",
                "294ae2f6-fdd6-4886-bc8a-6d4c67358744",
                "b4ea9335-fafa-4adc-8479-d60d29b16dc4",
                "8e64a78e-8183-4d1d-8552-800022acde5f",
                "2b40d6b3-8009-49de-9277-2a6e39cb1397",
                "9d30bfc7-ff0b-4d7a-9e8f-6e58fa21d849",
                "cbb9584d-9fc6-46e0-95c2-a061f491705d",
                "50757854-92b9-450f-b0e9-e360980e72f2",
                "0602328e-288a-4e46-931f-c2a83594f5e7",
                "31dae2a7-2266-41f3-b212-7d34ef46d5c9",
                "48cf67e7-8561-40b2-8a17-7ff6df120c91"
            ] })
        ]);
    }
};
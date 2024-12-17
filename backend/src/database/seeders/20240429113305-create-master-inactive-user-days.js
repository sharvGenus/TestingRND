"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query("INSERT INTO master_makers (id, name, is_active, created_at, updated_at) VALUES ('6ee88077-4674-47eb-8e02-9db23c8a6e52', 'INACTIVE-USER', '1', '2024-04-23 19:47:07.074309+05:30','2024-04-23 19:47:07.074309+05:30')");
        await queryInterface.sequelize.query("INSERT INTO master_maker_lovs (id, master_id, name, is_active, created_at, updated_at) VALUES ('bb767b94-8e19-4637-b281-2d0afa32ced6', '6ee88077-4674-47eb-8e02-9db23c8a6e52', '7', '1', '2024-04-23 19:47:07.074309+05:30','2024-04-23 19:47:07.074309+05:30')");
    },

    async down(queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.delete("master_makers", { id: "6ee88077-4674-47eb-8e02-9db23c8a6e52" }),
            queryInterface.delete("master_maker_lovs", { id: "bb767b94-8e19-4637-b281-2d0afa32ced6" })
        ]);
    }
};
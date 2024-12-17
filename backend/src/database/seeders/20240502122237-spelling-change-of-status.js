"use strict";
 
/** @type {import('sequelize-cli').Migration} */
 
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            "update master_maker_lovs set name = 'Created' where id = 'de6ae8b5-909a-4ea4-a518-bfad9bdbdd3d'"
        );
        await queryInterface.sequelize.query(
            "update master_maker_lovs set name = 'Updated' where id = '5ba80e90-6e3d-4a22-873f-9a10908d5a06'"
        );
        await queryInterface.sequelize.query(
            "update master_maker_lovs set name = 'Deleted' where id = 'c15f716f-5fc7-422c-8ac2-74c688dce2d1'"
        );
        await queryInterface.sequelize.query(
            "update master_maker_lovs set name = 'Restored' where id = '8e92b381-56ab-4191-af00-12f3c59c09bf'"
        );
        await queryInterface.sequelize.query(
            "update master_maker_lovs set name = 'AutoDeleted' where id = '40e66f7e-4088-4bd1-a555-c5b867b101c9'"
        );
    }
};
 
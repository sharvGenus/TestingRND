"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            "update all_masters_list set visible_name = 'Contractor', master_route = '/contractor-master/Contractor' where visible_name = 'Firm'"
        );
        await queryInterface.sequelize.query(
            "update all_masters_list set visible_name = 'Contractor Store', master_route = '/contractor-store-master/Contractor' where visible_name = 'Firm Store'"
        );
        await queryInterface.sequelize.query(
            "update all_masters_list set visible_name = 'Contractor Store Location', master_route = '/contractor-store-location-master/Contractor' where visible_name = 'Firm Store Location'"
        );
        await queryInterface.sequelize.query(
            "update all_masters_list set visible_name = 'Contractor Branch Office', master_route = '/contractor-location-master/Contractor' where visible_name = 'Firm Branch Office'"
        );
        await queryInterface.sequelize.query(
            "update master_maker_lovs set name = 'CONTRACTOR' where name = 'FIRM'"
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            "update all_masters_list set visible_name = 'Firm', master_route = '/firm-master/Firm' where visible_name = 'Contractor'"
        );
        await queryInterface.sequelize.query(
            "update all_masters_list set visible_name = 'Firm Store', master_route = '/firm-master/Firm' where visible_name = 'Contractor Store'"
        );
        await queryInterface.sequelize.query(
            "update all_masters_list set visible_name = 'Firm Store Location', master_route = '/firm-master/Firm' where visible_name = 'Contractor Store Location'"
        );
        await queryInterface.sequelize.query(
            "update all_masters_list set visible_name = 'Firm Branch Office', master_route = '/firm-master/Firm' where visible_name = 'Contractor Branch Office'"
        );
        await queryInterface.sequelize.query(
            "update master_maker_lovs set name = 'FIRM' where name = 'CONTRACTOR'"
        );
    }
};

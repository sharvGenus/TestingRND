"use strict";

const schemaName = "public";
const { ALL_MASTERS_LIST } = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        INSERT INTO
        ${schemaName}.${ALL_MASTERS_LIST} (
            id, 
            name, 
            visible_name, 
            access_flag, 
            grand_parent_id, 
            parent_id,
            is_master,
            master_route,
            rank
        )
        VALUES
        (
            '8109792c-c6f6-4b54-9e84-fff897900149',
            'qa_master_makers',
            'QA Master Maker',
            true,
            '654fb67d-edbc-4d7e-9848-dc41676cfc23',
            '7a345e62-6fc2-48c8-85e3-97d9bb5f7af4',
            true,
            '/qa-master-maker',
            5
        ),
        (
            '44d5b2b0-ec81-4ee6-acc2-0cfad4c703a2',
            'qa_master_maker_lovs',
            'QA Master Maker LOV',
            true,
            '654fb67d-edbc-4d7e-9848-dc41676cfc23',
            '7a345e62-6fc2-48c8-85e3-97d9bb5f7af4',
            true,
            '/qa-master-lov',
            6
        );
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
        DELETE FROM
        ${schemaName}.${ALL_MASTERS_LIST}
        WHERE id IN (
        '8109792c-c6f6-4b54-9e84-fff897900149', 
        '44d5b2b0-ec81-4ee6-acc2-0cfad4c703a2'
        `);
    }
};

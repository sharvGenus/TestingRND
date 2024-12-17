"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
        INSERT INTO all_masters_list (id, parent_id, grand_parent_id, name, visible_name, master_route, access_flag, is_active) VALUES
            (
                '99202fa3-dea6-47db-aa42-f9db7c97e41b',
                'bad5c521-fd62-4050-a7ed-6b95101f967f', '008a743f-e7df-4c2a-b9c2-c12682c90276',
                'installer_to_contractor', 'Installer to Contractor(ITC)', '/installer-to-contractor', 'true',
                '1'
            );

            -- create symmetry for location to location with other master routes
            UPDATE public.all_masters_list
            SET master_route='/location-to-location'
            WHERE id = '0143792a-40ba-4ac8-8d21-3b610b95d4a5';
        `);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.query(`
        DELETE FROM all_masters_list WHERE id = '99202fa3-dea6-47db-aa42-f9db7c97e41b';
        
        UPDATE public.all_masters_list
            SET master_route='/location-to-location'
            WHERE id = '0143792a-40ba-4ac8-8d21-3b610b95d4a5';
        `);
    }
};

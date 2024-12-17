"use strict";

const path = require("path");
const { seedFromCsv } = require("../services/run-seeder");
const { ALL_MASTERS_LIST, USER_MASTER_PERMISSIONS, ROLE_MASTER_PERMISSIONS } = require("../../config/database-schema");

const schemaName = "public";

module.exports = {
    up: async function (queryInterface, Sequelize) {

        const transaction = await queryInterface.sequelize.transaction();

        try {
            // delete "Dashboards" menu entry and its permissions
            // as it was created previously for demo purposes only
            await queryInterface.sequelize.query(
                `
                DELETE FROM ${schemaName}.${USER_MASTER_PERMISSIONS} WHERE master_id='80f348ff-2cf9-46aa-87d7-c33e47e00485';
                DELETE FROM ${schemaName}.${ROLE_MASTER_PERMISSIONS} WHERE master_id='80f348ff-2cf9-46aa-87d7-c33e47e00485';
                DELETE FROM ${schemaName}.${ALL_MASTERS_LIST} WHERE id='80f348ff-2cf9-46aa-87d7-c33e47e00485';
            `,
                { transaction }
            );

            // update the visible name of the old reports menu to "Old Reports", so as
            // to prevent issues with our current access management, which happens using
            // visible name
            await queryInterface.sequelize.query(
                `
                UPDATE ${schemaName}.${ALL_MASTERS_LIST}
                SET visible_name = 'Old Reports'
                WHERE id = 'ea5bc242-47c3-4f7e-ae8e-e8e8045b0a57';
            `,
                { transaction }
            );

            // update ranks of previous top level masters
            await queryInterface.sequelize.query(
                `
                UPDATE ${schemaName}.${ALL_MASTERS_LIST}
                SET rank = CASE id
                    WHEN '8e3b6289-05f9-4324-9a8d-ed93fac47db3' THEN 3 -- Users & Roles
                    WHEN '654fb67d-edbc-4d7e-9848-dc41676cfc23' THEN 4 -- Masters
                    WHEN '008a743f-e7df-4c2a-b9c2-c12682c90276' THEN 5 -- Inventory
                    WHEN 'd8715506-5f9b-42d9-b6cd-3a3784481174' THEN 6 -- Form Configurator
                    WHEN 'd8715506-5f9b-42d9-b6cd-3a3785481301' THEN 7 -- Helpdesk and Tickets
                END
                WHERE id IN (
                    '8e3b6289-05f9-4324-9a8d-ed93fac47db3',
                    '654fb67d-edbc-4d7e-9848-dc41676cfc23',
                    '008a743f-e7df-4c2a-b9c2-c12682c90276',
                    'd8715506-5f9b-42d9-b6cd-3a3784481174',
                    'd8715506-5f9b-42d9-b6cd-3a3785481301'
                );
            `,
                { transaction }
            );

            // insert new masters from CSV
            const file = path.join(__dirname, "csv", path.basename(__filename).replace(".js", ".csv"));
            const map = function (_data) {
                let i = 0;
                // eslint-disable-next-line no-return-assign
                const next = (step = 1) => i += step;
                return {
                    id: _data[next(0)],

                    name: _data[next()] || null,
                    visible_name: _data[next()],

                    parent_id: _data[next()] || null,
                    grand_parent_id: _data[next()] || null,

                    rank: _data[next()],

                    is_master: _data[next()] || false,
                    lov_access: _data[next()] || false,
                    access_flag: _data[next()] || null,

                    master_route: _data[next()] || null,

                    updated_at: _data[next()],
                    created_at: _data[next()],

                    table_type: "table",
                    is_active: "1"
                };
            };
            await seedFromCsv(queryInterface, ALL_MASTERS_LIST, file, map);

            // delete permissions for menus whose parent we will be updating
            // This section was not actively used till now and the related permissions are NOT IMPORTANT
            await queryInterface.sequelize.query(
                `
                DELETE FROM ${schemaName}.${USER_MASTER_PERMISSIONS} WHERE master_id IN (
                    '69da8365-413c-4b42-b670-4002cebc205e', -- Aging Of Material
                    '4c5e93c3-67a2-4a76-9a36-b5dd6e5220ed', -- Contractor Report
                    '575cce9e-d175-42b3-868d-418d5412d650', -- Document Wise Report
                    'fecd13bd-0f33-4b8e-b298-c8a7d4ee6f85' -- Stock Report
                );
            `,
                { transaction }
            );

            // move the following menus to the newly created parent form CSV (Inventory Reports)
            // and grand parent (Reports) as the newly created Reports group
            await queryInterface.sequelize.query(
                `
                UPDATE ${schemaName}.${ALL_MASTERS_LIST}
                SET
                    parent_id = '8b3c564d-9558-4c24-899f-e22113f15c96',
                    grand_parent_id = '8b682419-3d70-4c52-b229-c82b5559aec8',
                    rank = CASE id
                        WHEN '69da8365-413c-4b42-b670-4002cebc205e' THEN 1 -- Aging Of Material
                        WHEN '4c5e93c3-67a2-4a76-9a36-b5dd6e5220ed' THEN 2 -- Contractor Report
                        WHEN '575cce9e-d175-42b3-868d-418d5412d650' THEN 3 -- Document Wise Report
                        WHEN 'fecd13bd-0f33-4b8e-b298-c8a7d4ee6f85' THEN 4 -- Stock Report
                    END
                WHERE id IN (
                    '69da8365-413c-4b42-b670-4002cebc205e',
                    '4c5e93c3-67a2-4a76-9a36-b5dd6e5220ed',
                    '575cce9e-d175-42b3-868d-418d5412d650',
                    'fecd13bd-0f33-4b8e-b298-c8a7d4ee6f85'
                );
            `,
                { transaction }
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            console.log(error, "error");
            throw new Error(
                "Error while executing dashboards-and-reports-sidebar-entries updates",
                error
            );
        }
    },
    down: function (queryInterface, Sequelize) {
        // complex down migration, infeasable to write due to this
    }
};

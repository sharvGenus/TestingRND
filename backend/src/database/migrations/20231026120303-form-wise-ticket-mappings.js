"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(config.FORM_WISE_TICKET_MAPPINGS, {
            id: {
                type: Sequelize.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: Sequelize.UUIDV4
            },
            projectId: {
                type: Sequelize.UUID,
                field: "project_id",
                references: {
                    model: config.PROJECTS,
                    key: "id"
                }
            },
            formTypeId: {
                type: Sequelize.UUID,
                field: "form_type_id",
                references: {
                    model: config.MASTER_MAKER_LOVS,
                    key: "id"
                }
            },
            formId: {
                type: Sequelize.UUID,
                field: "form_id",
                references: {
                    model: config.FORMS,
                    key: "id"
                }
            },
            searchFields: {
                type: Sequelize.ARRAY(Sequelize.UUID),
                field: "search_fields",
                allowNull: false
            },
            mobileFields: {
                type: Sequelize.ARRAY(Sequelize.UUID),
                field: "mobile_fields",
                allowNull: false
            },
            geoLocationField: {
                type: Sequelize.UUID,
                field: "geo_location_field",
                allowNull: false
            },
            displayFields: {
                type: Sequelize.ARRAY(Sequelize.UUID),
                field: "display_fields",
                allowNull: false
            },
            isActive: {
                type: Sequelize.ENUM,
                field: "is_active",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
            },
            remarks: {
                type: Sequelize.STRING,
                field: "remarks"
            },
            createdBy: {
                type: Sequelize.UUID,
                field: "created_by"
            },
            updatedBy: {
                type: Sequelize.UUID,
                field: "updated_by"
            },
            createdAt: {
                type: Sequelize.DATE,
                field: "created_at",
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                field: "updated_at",
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false
            },
            deletedAt: {
                type: Sequelize.DATE,
                field: "deleted_at"
            }
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable(config.FORM_WISE_TICKET_MAPPINGS);
    }
};

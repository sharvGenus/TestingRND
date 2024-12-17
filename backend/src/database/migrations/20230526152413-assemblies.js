"use strict";

const { ASSEMBLY_CONSTITUENCIES, CITIES, PARLIAMENTARY_CONSTITUENCIES, COUNTRIES, STATES } = require("../../config/database-schema");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(ASSEMBLY_CONSTITUENCIES, {
            id: {
                type: Sequelize.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: Sequelize.UUIDV4
            },
            name: {
                type: Sequelize.STRING,
                field: "name",
                allowNull: false
            },
            code: {
                type: Sequelize.STRING,
                field: "code",
                allowNull: true
            },
            countryId: {
                type: Sequelize.UUID,
                field: "country_id",
                references: {
                    model: COUNTRIES,
                    key: "id"
                }
            },
            stateId: {
                type: Sequelize.UUID,
                field: "state_id",
                references: {
                    model: STATES,
                    key: "id"
                }
            },
            cityId: {
                type: Sequelize.UUID,
                field: "city_id",
                references: {
                    model: CITIES,
                    key: "id"
                }
            },
            parliamentaryId: {
                type: Sequelize.UUID,
                field: "parliamentary_id",
                references: {
                    model: PARLIAMENTARY_CONSTITUENCIES,
                    key: "id"
                }
            },
            status: {
                type: Sequelize.ENUM,
                field: "status",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
            },
            remarks: {
                type: Sequelize.STRING,
                field: "remarks"
            },
            isDeleted: {
                type: Sequelize.BOOLEAN,
                field: "is_deleted"
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
        return queryInterface.dropTable(ASSEMBLY_CONSTITUENCIES);
    }
};

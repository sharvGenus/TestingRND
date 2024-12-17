const { PROJECTS, ORGANIZATIONS } = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await queryInterface.createTable(
            PROJECTS,
            {
                id: {
                    type: Sequelize.UUID,
                    field: "id",
                    primaryKey: true,
                    unique: true,
                    defaultValue: Sequelize.UUIDV4
                },
                integrationId: {
                    type: Sequelize.STRING,
                    field: "integration_id"
                },
                companyId: {
                    type: Sequelize.UUID,
                    field: "company_id",
                    references: {
                        model: ORGANIZATIONS,
                        key: "id"
                    }
                },
                customerId: {
                    type: Sequelize.UUID,
                    field: "customer_id",
                    references: {
                        model: ORGANIZATIONS,
                        key: "id"
                    }
                },
                name: {
                    type: Sequelize.STRING,
                    field: "name",
                    allowNull: false
                },
                Code: {
                    type: Sequelize.STRING,
                    field: "code",
                    allowNull: false
                },
                poWorkOrderNumber: {
                    type: Sequelize.STRING,
                    field: "po_work_order_number",
                    allowNull: false
                },
                poStartDate: {
                    type: Sequelize.DATE,
                    field: "po_start_date",
                    allowNull: false
                },
                poEndDate: {
                    type: Sequelize.DATE,
                    field: "po_end_date",
                    allowNull: false

                },
                poExtensionDate: {
                    type: Sequelize.DATE,
                    field: "po_extension_date",
                    allowNull: false
                },
                closureDate: {
                    type: Sequelize.DATE,
                    field: "closure_date",
                    allowNull: false
                },
                fmsStartDate: {
                    type: Sequelize.DATE,
                    field: "fms_start_date",
                    allowNull: false
                },
                fmsEndDate: {
                    type: Sequelize.DATE,
                    field: "fms_end_date",
                    allowNull: false
                },
                fmsYears: {
                    type: Sequelize.STRING,
                    field: "fms_years",
                    allowNull: false
                },
                attachments: {
                    type: Sequelize.STRING,
                    field: "attachments"
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
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable(PROJECTS);
    }
};

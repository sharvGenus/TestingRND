const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const tickets = sequelize.define(
        config.PROJECT_WISE_TICKET_MAPPINGS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            projectId: {
                type: DataTypes.UUID,
                field: "project_id"
            },
            issueFields: {
                type: DataTypes.ARRAY(DataTypes.UUID),
                field: "issue_fields",
                allowNull: false
            },
            forms: {
                type: DataTypes.ARRAY(DataTypes.UUID),
                field: "forms",
                allowNull: false
            },
            ticketIndex: {
                type: DataTypes.INTEGER,
                field: "ticket_index"
            },
            prefix: {
                type: DataTypes.STRING,
                field: "prefix"
            },
            isActive: {
                type: DataTypes.ENUM,
                field: "is_active",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks"
            },
            createdBy: {
                type: DataTypes.UUID,
                field: "created_by"
            },
            updatedBy: {
                type: DataTypes.UUID,
                field: "updated_by"
            },
            createdAt: {
                type: DataTypes.DATE,
                field: "created_at",
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: "updated_at",
                defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false
            },
            deletedAt: {
                type: DataTypes.DATE,
                field: "deleted_at"
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                tickets.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                tickets.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                tickets.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return tickets;
};

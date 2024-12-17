const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const formNotifications = sequelize.define(
        config.FORMS_NOTIFICATIONS,
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
            category: {
                type: DataTypes.ENUM,
                field: "category",
                values: ["resurvey", "handt"],
                allowNull: false
            },
            isRead: {
                type: DataTypes.BOOLEAN,
                field: "is_read",
                defaultValue: false
            },
            formId: {
                type: DataTypes.UUID,
                field: "form_id"
            },
            responseId: {
                type: DataTypes.UUID,
                field: "response_id"
            },
            ticketId: {
                type: DataTypes.UUID,
                field: "ticket_id"
            },
            userId: {
                type: DataTypes.UUID,
                field: "user_id"
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
            }
        },
        {
            freezeTableName: true,
            associate: (models) => {
                formNotifications.belongsTo(models[config.USERS], { foreignKey: "user_id", as: "users" });
                formNotifications.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                formNotifications.belongsTo(models[config.FORMS], { foreignKey: "form_id" });
                formNotifications.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "createdByUser" });
                formNotifications.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updatedByUser" });
                formNotifications.belongsTo(models[config.TICKETS], { foreignKey: "ticketId" });
            }
        }
    );

    return formNotifications;
};

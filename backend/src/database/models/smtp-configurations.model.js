const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const smtpConfigurations = sequelize.define(
        config.SMTP_CONFIGURATIONS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            server: {
                type: DataTypes.STRING,
                field: "server",
                allowNull: false
            },
            port: {
                type: DataTypes.INTEGER,
                field: "port",
                allowNull: false
            },
            encryption: {
                type: DataTypes.STRING,
                field: "encryption",
                allowNull: false
            },
            username: {
                type: DataTypes.STRING,
                field: "usermane",
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                field: "password",
                allowNull: false
            },
            salt: {
                type: DataTypes.STRING,
                field: "salt",
                allowNull: false
            },
            remarks: {
                type: DataTypes.STRING,
                field: "remarks"
            },
            isActive: {
                type: DataTypes.ENUM,
                field: "is_active",
                values: ["0", "1"],
                allowNull: false,
                defaultValue: "1"
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
                field: "deleted_at",
            }
        },
        {
            freezeTableName: true,
            paranoid: true
        }
    );

    return smtpConfigurations;
};
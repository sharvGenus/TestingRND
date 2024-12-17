const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const escalationLevels = sequelize.define(
        config.ESCALATION_LEVELS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            to: {
                type: DataTypes.ARRAY(DataTypes.UUID),
                field: "to",
                allowNull: false
            },
            cc: {
                type: DataTypes.ARRAY(DataTypes.UUID),
                field: "cc",
                allowNull: false
            },
            escalationId: {
                type: DataTypes.UUID,
                field: "escalation_id"
            },
            level: {
                type: DataTypes.NUMBER,
                field: "level"
            },
            time: {
                type: DataTypes.STRING,
                field: "time"
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
                field: "deleted_at"
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                escalationLevels.belongsTo(models[config.ESCALATION_MATRIX], { foreignKey: "escalation_id" });
                escalationLevels.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                escalationLevels.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return escalationLevels;
};

const { USERS, UESR_SESSOINS } = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const userSessions = sequelize.define(
        UESR_SESSOINS,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            userId: {
                type: DataTypes.UUID,
                field: "user_id",
                references: {
                    model: USERS,
                    key: "id"
                }
            },
            lastActiveAt: {
                type: DataTypes.DATE,
                field: "last_active_at",
                allowNull: false
            },
            userAgent: {
                type: DataTypes.TEXT,
                field: "user_agent"
            },
            loggedInUsingOTP: {
                type: DataTypes.BOOLEAN,
                field: "logged_in_using_otp",
                defaultValue: false
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
                userSessions.belongsTo(models[USERS], { foreignKey: "user_id" });
            }
        }
    );

    return userSessions;
};

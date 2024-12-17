const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const dailyExecutionPlans = sequelize.define(
        config.DAILY_EXECUTION_PLANS,
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
            materialTypeId: {
                type: DataTypes.UUID,
                field: "material_type_id"
            },
            month: {
                type: DataTypes.INTEGER,
                field: "month",
                allowNull: false
            },
            year: {
                type: DataTypes.INTEGER,
                field: "year",
                allowNull: false
            },
            q1: {
                type: DataTypes.FLOAT,
                field: "q1"
            },
            q2: {
                type: DataTypes.FLOAT,
                field: "q2"
            },
            q3: {
                type: DataTypes.FLOAT,
                field: "q3"
            },
            q4: {
                type: DataTypes.FLOAT,
                field: "q4"
            },
            q5: {
                type: DataTypes.FLOAT,
                field: "q5"
            },
            q6: {
                type: DataTypes.FLOAT,
                field: "q6"
            },
            q7: {
                type: DataTypes.FLOAT,
                field: "q7"
            },
            q8: {
                type: DataTypes.FLOAT,
                field: "q8"
            },
            q9: {
                type: DataTypes.FLOAT,
                field: "q9"
            },
            q10: {
                type: DataTypes.FLOAT,
                field: "q10"
            },
            q11: {
                type: DataTypes.FLOAT,
                field: "q11"
            },
            q12: {
                type: DataTypes.FLOAT,
                field: "q12"
            },
            q13: {
                type: DataTypes.FLOAT,
                field: "q13"
            },
            q14: {
                type: DataTypes.FLOAT,
                field: "q14"
            },
            q15: {
                type: DataTypes.FLOAT,
                field: "q15"
            },
            q16: {
                type: DataTypes.FLOAT,
                field: "q16"
            },
            q17: {
                type: DataTypes.FLOAT,
                field: "q17"
            },
            q18: {
                type: DataTypes.FLOAT,
                field: "q18"
            },
            q19: {
                type: DataTypes.FLOAT,
                field: "q19"
            },
            q20: {
                type: DataTypes.FLOAT,
                field: "q20"
            },
            q21: {
                type: DataTypes.FLOAT,
                field: "q21"
            },
            q22: {
                type: DataTypes.FLOAT,
                field: "q22"
            },
            q23: {
                type: DataTypes.FLOAT,
                field: "q23"
            },
            q24: {
                type: DataTypes.FLOAT,
                field: "q24"
            },
            q25: {
                type: DataTypes.FLOAT,
                field: "q25"
            },
            q26: {
                type: DataTypes.FLOAT,
                field: "q26"
            },
            q27: {
                type: DataTypes.FLOAT,
                field: "q27"
            },
            q28: {
                type: DataTypes.FLOAT,
                field: "q28"
            },
            q29: {
                type: DataTypes.FLOAT,
                field: "q29"
            },
            q30: {
                type: DataTypes.FLOAT,
                field: "q30"
            },
            q31: {
                type: DataTypes.FLOAT,
                field: "q31"
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
                field: "deleted_at"
            }
        },
        {
            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                dailyExecutionPlans.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                dailyExecutionPlans.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "material_type_id" });
                dailyExecutionPlans.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                dailyExecutionPlans.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return dailyExecutionPlans;
};
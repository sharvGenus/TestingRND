const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const qaMasterMakerLovsHistory = sequelize.define(
        config.QA_MASTER_MAKER_LOVS_HISTORY,
        {
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            masterId: {
                type: DataTypes.UUID,
                field: "master_id",
                allowNull: false
            },
            majorContributor: {
                type: DataTypes.STRING,
                field: "major_contributor",
                allowNull: false
            },
            code: {
                type: DataTypes.STRING,
                field: "code",
                allowNull: false
            },
            priority: {
                type: DataTypes.INTEGER,
                field: "priority",
                allowNull: false
            },
            defect: {
                type: DataTypes.STRING,
                field: "defect",
                allowNull: false
            },
            observationTypeId: {
                type: DataTypes.UUID,
                field: "observation_type_id",
                allowNull: false
            },
            observationSeverityId: {
                type: DataTypes.UUID,
                field: "observation_severity_id",
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
                field: "deleted_at"
            },
            recordId: {
                type: DataTypes.UUID,
                field: "record_id"
            }
        },
        {

            freezeTableName: true,
            paranoid: true,
            associate: (models) => {
                qaMasterMakerLovsHistory.belongsTo(models[config.QA_MASTER_MAKERS], { foreignKey: "master_id" });
                qaMasterMakerLovsHistory.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "observation_type_id", as: "observation_type" });
                qaMasterMakerLovsHistory.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "observation_severity_id", as: "observation_severity" });
                qaMasterMakerLovsHistory.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                qaMasterMakerLovsHistory.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return qaMasterMakerLovsHistory;
};

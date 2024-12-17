const schema = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const projectMasterMakerLovsHistory = sequelize.define(
        schema.PROJECT_MASTER_MAKER_LOVS_HISTORY,
        {
            masterId: {
                type: DataTypes.UUID,
                field: "master_id"
            },
            id: {
                type: DataTypes.UUID,
                field: "id",
                primaryKey: true,
                unique: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: "name"
            },
            code: {
                type: DataTypes.STRING,
                field: "code",
                allowNull: false,
                defaultValue: "NA"
            },
            description: {
                type: DataTypes.STRING,
                field: "description"
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
                projectMasterMakerLovsHistory.belongsTo(models[schema.PROJECT_MASTER_MAKERS], { foreignKey: "master_id" });
                projectMasterMakerLovsHistory.belongsTo(models[schema.USERS], { foreignKey: "created_by", as: "created" });
                projectMasterMakerLovsHistory.belongsTo(models[schema.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return projectMasterMakerLovsHistory;
};

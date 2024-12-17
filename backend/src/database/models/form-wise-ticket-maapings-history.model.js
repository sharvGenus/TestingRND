const config = require("../../config/database-schema");

module.exports = function (sequelize, DataTypes) {
    const tickets = sequelize.define(
        config.FORM_WISE_TICKET_MAPPINGS_HISTORY,
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
            formTypeId: {
                type: DataTypes.UUID,
                field: "form_type_id"
            },
            formId: {
                type: DataTypes.UUID,
                field: "form_id"
            },
            searchFields: {
                type: DataTypes.ARRAY(DataTypes.UUID),
                field: "search_fields",
                allowNull: false
            },
            mobileFields: {
                type: DataTypes.ARRAY(DataTypes.UUID),
                field: "mobile_fields",
                allowNull: false
            },
            geoLocationField: {
                type: DataTypes.UUID,
                field: "geo_location_field",
                allowNull: false
            },
            displayFields: {
                type: DataTypes.ARRAY(DataTypes.UUID),
                field: "display_fields",
                allowNull: false
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
                tickets.belongsTo(models[config.PROJECTS], { foreignKey: "project_id" });
                tickets.belongsTo(models[config.FORMS], { foreignKey: "form_id" });
                tickets.belongsTo(models[config.MASTER_MAKER_LOVS], { foreignKey: "form_type_id", as: "form_type_obj" });
                tickets.belongsTo(models[config.USERS], { foreignKey: "created_by", as: "created" });
                tickets.belongsTo(models[config.USERS], { foreignKey: "updated_by", as: "updated" });
            }
        }
    );

    return tickets;
};

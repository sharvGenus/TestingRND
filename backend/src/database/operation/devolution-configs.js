const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for devolution_configs table
 * 
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           29 Aug 2024
 * 
 * @class DevolutionConfigs
 */
class DevolutionConfigs extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.DEVOLUTION_CONFIGS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            projectId: "project_id",
            formId: "form_id",
            prefix: "prefix",
            index: "index",
            oldSerialNoId: "old_serial_no_id",
            oldMakeId: "old_make_id",
            newSerialNoId: "new_serial_no_id",
            newMakeId: "new_make_id",
            isLocked: "is_locked",
            remarks: "remarks",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at"
        };
        this.fieldsList = Object.keys(this.fields);
        this.relations = [
            {
                model: this.db[config.PROJECTS],
                attributes: ["id", "name"]
            },
            {
                model: this.db[config.FORMS],
                attributes: ["id", "name"],
                include: [{
                    model: this.db[config.MASTER_MAKER_LOVS],
                    attributes: ["id", "name"]
                }]
            },
            {
                model: this.db[config.FORM_ATTRIBUTES],
                attributes: ["id", "name", "columnName"],
                foreignKey: "old_serial_no_id",
                as: "old_serial_no"
            },
            {
                model: this.db[config.FORM_ATTRIBUTES],
                attributes: ["id", "name", "columnName"],
                foreignKey: "old_make_id",
                as: "old_make"
            },
            {
                model: this.db[config.FORM_ATTRIBUTES],
                attributes: ["id", "name", "columnName"],
                foreignKey: "new_serial_no_id",
                as: "new_serial_no"
            },
            {
                model: this.db[config.FORM_ATTRIBUTES],
                attributes: ["id", "name", "columnName"],
                foreignKey: "new_make_id",
                as: "new_make"
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name"],
                foreignKey: "created_by",
                as: "created"
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name"],
                foreignKey: "updated_by",
                as: "updated"
            }
        ];
    }

    /**
     * Method to create new records in database with association
     * @param {Object} payLoad
     * @param {Object} transaction
     * @returns {Promise<Object>}
     */
    async createWithAssociation(payLoad, transaction) {
        if (payLoad && this.userData?.userId) {
            const setUserId = (obj) => {
                if (!obj.createdBy) {
                    obj.createdBy = this.userData.userId;
                }
                if (!obj.updatedBy) {
                    obj.updatedBy = this.userData.userId;
                }
            };
            setUserId(payLoad);
            if (payLoad.devolution_mappings) {
                payLoad.devolution_mappings.forEach((mapping) => {
                    setUserId(mapping);
                });
            }
        }
        return this.model.create(
            payLoad,
            {
                include: [{
                    association: config.DEVOLUTION_MAPPINGS
                }]
            },
            {
                transaction,
                individualHooks: true,
                returning: true
            }
        );
    }
}

module.exports = DevolutionConfigs;
const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for devolutions table
 * 
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           05 Sep 2024
 * 
 * @class Devolutions
 */
class Devolutions extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.DEVOLUTIONS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            devolutionDocNo: "devolution_doc_no",
            projectId: "project_id",
            formId: "form_id",
            customerId: "customer_id",
            customerStoreId: "customer_store_id",
            quantity: "quantity",
            devolutionConfigId: "devolution_config_id",
            gaaHierarchy: "gaa_hierarchy",
            attachments: "attachments",
            approvalStatus: "approval_status",
            approverId: "approver_id",
            approvalDate: "approval_date",
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
                model: this.db[config.ORGANIZATIONS],
                attributes: ["id", "name", "code"]
            },
            {
                model: this.db[config.ORGANIZATION_STORES],
                attributes: ["id", "name", "code"]
            },
            {
                model: this.db[config.USERS],
                attributes: ["id", "name"],
                foreignKey: "approver_id",
                as: "approver"
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
            if (payLoad.devolution_materials) {
                payLoad.devolution_materials.forEach((material) => {
                    setUserId(material);
                });
            }
        }
        return this.model.create(
            payLoad,
            {
                include: [{
                    association: config.DEVOLUTION_MATERIALS
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

module.exports = Devolutions;
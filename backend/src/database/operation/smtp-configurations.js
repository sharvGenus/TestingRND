const config = require("../../config/database-schema");
const { Base } = require("./base");

/**
 * Represents a database tables object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others for smtp_configurations table
 * 
 * Created by               Version                         Date
 * Ajnesh                   1.0.0                           14 Jul 2023
 * 
 * @class SmtpConfigurations
 */
class SmtpConfigurations extends Base {
    
    constructor(requestQuery) {
        super(requestQuery);
        this.modelName = config.SMTP_CONFIGURATIONS;
        this.initialiseModel();
        this.fields = {
            id: "id",
            server: "server",
            port: "port",
            encryption: "encryption",
            username: "usermane",
            password: "__password",
            salt: "__salt",
            remarks: "remarks",
            isActive: "is_active",
            createdBy: "created_by",
            updatedBy: "updated_by",
            createdAt: "created_at",
            updatedAt: "updated_at"
        };
        this.fieldsList = Object.keys(this.fields);
    }

}

module.exports = SmtpConfigurations;
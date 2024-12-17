"use strict";
 
const config = require("../../config/database-schema");
 
module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([
            queryInterface.addColumn(
                config.EMAIL_TEMPLATES,
                "project_id",
                {
                    type: Sequelize.UUID,
                    field: "project_id",
                    references: {
                        model: config.PROJECTS,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                config.EMAIL_TEMPLATES,
                "organization_id",
                {
                    type: Sequelize.UUID,
                    field: "organization_id",
                    references: {
                        model: config.ORGANIZATIONS,
                        key: "id"
                    }
                }
            ),
            queryInterface.addColumn(
                config.EMAIL_TEMPLATES,
                "for_approver",
                {
                    type: Sequelize.BOOLEAN,
                    field: "for_approver",
                    allowNull: false,
                    defaultValue: false
                }
            ),
            queryInterface.addColumn(
                config.EMAIL_TEMPLATES,
                "from",
                {
                    type: Sequelize.STRING,
                    field: "from",
                    allowNull: false
                }
            ),
            queryInterface.addColumn(
                config.EMAIL_TEMPLATES,
                "to",
                {
                    type: Sequelize.ARRAY(Sequelize.STRING),
                    field: "to",
                    allowNull: false
                }
            ),
            queryInterface.addColumn(
                config.EMAIL_TEMPLATES,
                "cc",
                {
                    type: Sequelize.ARRAY(Sequelize.STRING),
                    field: "cc",
                    allowNull: false
                }
            ),
            queryInterface.addColumn(
                config.EMAIL_TEMPLATES,
                "bcc",
                {
                    type: Sequelize.ARRAY(Sequelize.STRING),
                    field: "bcc",
                    allowNull: false
                }
            )
        ]);
    },
 
    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn(config.EMAIL_TEMPLATES, "project_id", "organization_id", "for_approver", "from", "to", "cc", "bcc");
    }
};

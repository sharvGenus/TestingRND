"use strict";

const config = require("../../config/database-schema");

module.exports = {
    up: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.changeColumn(config.ORGANIZATIONS, "organization_type_id", {
                type: Sequelize.UUID,
                field: "organization_type_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.ORGANIZATIONS, "gst_number", {
                type: Sequelize.STRING,
                field: "gst_number",
                allowNull: false,
                defaultValue: null
            }),
            queryInterface.changeColumn(config.ORGANIZATIONS, "city_id", {
                type: Sequelize.UUID,
                field: "city_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.ORGANIZATIONS, "email", {
                type: Sequelize.STRING,
                field: "email",
                allowNull: false
            }),
            queryInterface.changeColumn(config.ORGANIZATION_STORES, "organization_type", {
                type: Sequelize.UUID,
                field: "organization_type",
                allowNull: false
            }),
            queryInterface.changeColumn(config.ORGANIZATION_STORES, "organization_id", {
                type: Sequelize.UUID,
                field: "organization_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.ORGANIZATION_STORES, "city_id", {
                type: Sequelize.UUID,
                field: "city_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.ORGANIZATION_STORE_LOCATIONS, "organization_type", {
                type: Sequelize.UUID,
                field: "organization_type",
                allowNull: false
            }),
            queryInterface.changeColumn(config.ORGANIZATION_STORE_LOCATIONS, "organization_store_id", {
                type: Sequelize.UUID,
                field: "organization_store_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.ORGANIZATION_STORE_LOCATIONS, "project_id", {
                type: Sequelize.UUID,
                field: "project_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.PROJECTS, "company_id", {
                type: Sequelize.UUID,
                field: "company_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.PROJECTS, "customer_id", {
                type: Sequelize.UUID,
                field: "customer_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.APPROVERS, "transaction_type_id", {
                type: Sequelize.UUID,
                field: "transaction_type_id",
                allowNull: false
            }),
            // queryInterface.changeColumn(config.APPROVERS, "store_id", {
            //     type: Sequelize.UUID,
            //     field: "store_id",
            //     allowNull: false
            // }),
            queryInterface.changeColumn(config.APPROVERS, "project_id", {
                type: Sequelize.UUID,
                field: "project_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.APPROVERS, "user_id", {
                type: Sequelize.UUID,
                field: "user_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.APPROVERS, "organization_name_id", {
                type: Sequelize.UUID,
                field: "organization_name_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.APPROVERS, "organization_type_id", {
                type: Sequelize.UUID,
                field: "organization_type_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.MATERIALS, "material_type_id", {
                type: Sequelize.UUID,
                field: "material_type_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.MATERIALS, "uom_id", {
                type: Sequelize.UUID,
                field: "uom_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.MASTER_MAKER_LOVS, "master_id", {
                type: Sequelize.UUID,
                field: "master_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.EMAIL_TEMPLATES, "transaction_type_id", {
                type: Sequelize.UUID,
                field: "transaction_type_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.EMAIL_TEMPLATES, "project_id", {
                type: Sequelize.UUID,
                field: "project_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.EMAIL_TEMPLATES, "organization_id", {
                type: Sequelize.UUID,
                field: "organization_id",
                allowNull: false
            }),
            queryInterface.changeColumn(config.EMAIL_TEMPLATES, "template_name", {
                type: Sequelize.STRING,
                field: "template_name",
                allowNull: false
            })
        ]);
     
    },

    down: async function (queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.changeColumn(config.ORGANIZATIONS, "organization_type_id", {
                type: Sequelize.UUID,
                field: "organization_type_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.ORGANIZATIONS, "gst_number", {
                type: Sequelize.STRING,
                field: "gst_number",
                allowNull: true
            }),
            queryInterface.changeColumn(config.ORGANIZATIONS, "city_id", {
                type: Sequelize.UUID,
                field: "city_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.ORGANIZATIONS, "email", {
                type: Sequelize.STRING,
                field: "email",
                allowNull: true
            }),
            queryInterface.changeColumn(config.ORGANIZATION_STORES, "organization_type", {
                type: Sequelize.UUID,
                field: "organization_type",
                allowNull: true
            }),
            queryInterface.changeColumn(config.ORGANIZATION_STORES, "organization_id", {
                type: Sequelize.UUID,
                field: "organization_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.ORGANIZATION_STORES, "city_id", {
                type: Sequelize.UUID,
                field: "city_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.ORGANIZATION_STORE_LOCATIONS, "organization_type", {
                type: Sequelize.UUID,
                field: "organization_type",
                allowNull: true
            }),
            queryInterface.changeColumn(config.ORGANIZATION_STORE_LOCATIONS, "organization_store_id", {
                type: Sequelize.UUID,
                field: "organization_store_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.ORGANIZATION_STORE_LOCATIONS, "project_id", {
                type: Sequelize.UUID,
                field: "project_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.PROJECTS, "company_id", {
                type: Sequelize.UUID,
                field: "company_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.PROJECTS, "customer_id", {
                type: Sequelize.UUID,
                field: "customer_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.APPROVERS, "transaction_type_id", {
                type: Sequelize.UUID,
                field: "transaction_type_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.APPROVERS, "store_id", {
                type: Sequelize.UUID,
                field: "store_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.APPROVERS, "project_id", {
                type: Sequelize.UUID,
                field: "project_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.APPROVERS, "user_id", {
                type: Sequelize.UUID,
                field: "user_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.APPROVERS, "organization_name_id", {
                type: Sequelize.UUID,
                field: "organization_name_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.APPROVERS, "organization_type_id", {
                type: Sequelize.UUID,
                field: "organization_type_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.MATERIALS, "material_type_id", {
                type: Sequelize.UUID,
                field: "material_type_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.MATERIALS, "uom_id", {
                type: Sequelize.UUID,
                field: "uom_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.MASTER_MAKER_LOVS, "master_id", {
                type: Sequelize.UUID,
                field: "master_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.EMAIL_TEMPLATES, "transaction_type_id", {
                type: Sequelize.UUID,
                field: "transaction_type_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.EMAIL_TEMPLATES, "project_id", {
                type: Sequelize.UUID,
                field: "project_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.EMAIL_TEMPLATES, "organization_id", {
                type: Sequelize.UUID,
                field: "organization_id",
                allowNull: true
            }),
            queryInterface.changeColumn(config.EMAIL_TEMPLATES, "template_name", {
                type: Sequelize.STRING,
                field: "template_name",
                allowNull: true
            })
        ]);
    }
};

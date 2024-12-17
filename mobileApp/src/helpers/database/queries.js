export const formsList = `SELECT
    "forms"."id",
    "forms"."name",
    "forms"."integration_id" AS "integrationId",
    "forms"."table_name" AS "tableName",
    "forms"."search_columns" AS "searchColumns",
    "forms"."mapping_table_id" AS "mappingTableId",
    "forms"."total_counts" AS "totalCounts",
    "forms"."approved_counts" AS "approvedCounts",
    "forms"."rejected_counts" AS "rejectedCounts",
    "forms"."is_published" AS "isPublished",
    "forms"."sequence",
    "forms"."project_id" AS "projectId",
    "forms"."form_type_id" AS "formTypeId",
    "forms"."remarks",
    "forms"."is_active" AS "isActive",
    "forms"."created_by" AS "createdBy",
    "forms"."updated_by" AS "updatedBy",
    "forms"."created_at" AS "createdAt",
    "forms"."updated_at" AS "updatedAt",
    "project"."id" AS "project.id",
    "project"."name" AS "project.name",
    "project"."code" AS "project.code",
    "master_maker_lov"."id" AS "master_maker_lov.id",
    "master_maker_lov"."name" AS "master_maker_lov.name",
    "form_attributes"."id" AS "form_attributes.id",
    "form_attributes"."name" AS "form_attributes.name",
    "form_attributes"."column_name" AS "form_attributes.columnName",
    "form_attributes"."mapping_column_id" AS "form_attributes.mappingColumnId",
    "form_attributes"."rank" AS "form_attributes.rank",
    "form_attributes"."screen_type" AS "form_attributes.screenType",
    "form_attributes"."properties" AS "form_attributes.properties",
    "form_attributes"."form_id" AS "form_attributes.formId",
    "form_attributes"."default_attribute_id" AS "form_attributes.defaultAttributeId",
    "form_attributes"."is_required" AS "form_attributes.isRequired",
    "form_attributes"."is_unique" AS "form_attributes.isUnique",
    "form_attributes"."is_null" AS "form_attributes.isNull",
    "form_attributes"."is_active" AS "form_attributes.isActive",
    "form_attributes"."created_by" AS "form_attributes.createdBy",
    "form_attributes"."updated_by" AS "form_attributes.updatedBy",
    "form_attributes"."created_at" AS "form_attributes.createdAt",
    "form_attributes"."updated_at" AS "form_attributes.updatedAt",
    "form_attributes"."deleted_at" AS "form_attributes.deletedAt",
    "form_attributes"."mapping_column_id" AS "form_attributes.mapping_column_id",
    "form_attributes"."default_attribute_id" AS "form_attributes.default_attribute_id",
    "form_attributes"."form_id" AS "form_attributes.form_id",
    "form_attributes->default_attribute"."id" AS "form_attributes.default_attribute.id",
    "form_attributes->default_attribute"."integration_id" AS "form_attributes.default_attribute.integrationId",
    "form_attributes->default_attribute"."name" AS "form_attributes.default_attribute.name",
    "form_attributes->default_attribute"."rank" AS "form_attributes.default_attribute.rank",
    "form_attributes->default_attribute"."type" AS "form_attributes.default_attribute.type",
    "form_attributes->default_attribute"."validation" AS "form_attributes.default_attribute.validation",
    "form_attributes->default_attribute"."is_active" AS "form_attributes.default_attribute.isActive",
    "form_attributes->default_attribute"."created_by" AS "form_attributes.default_attribute.createdBy",
    "form_attributes->default_attribute"."updated_by" AS "form_attributes.default_attribute.updatedBy",
    "form_attributes->default_attribute"."input_type" AS "form_attributes.default_attribute.inputType",
    "form_attributes->default_attribute"."created_at" AS "form_attributes.default_attribute.createdAt",
    "form_attributes->default_attribute"."updated_at" AS "form_attributes.default_attribute.updatedAt",
    "form_attributes->default_attribute"."deleted_at" AS "form_attributes.default_attribute.deletedAt"
FROM
    "forms" AS "forms"
    LEFT OUTER JOIN "projects" AS "project" ON "forms"."project_id" = "project"."id"
    AND ("project"."deleted_at" IS NULL)
    LEFT OUTER JOIN "master_maker_lovs" AS "master_maker_lov" ON "forms"."form_type_id" = "master_maker_lov"."id"
    AND ("master_maker_lov"."deleted_at" IS NULL)
    LEFT OUTER JOIN "form_attributes" AS "form_attributes" ON "forms"."id" = "form_attributes"."form_id"
    AND ("form_attributes"."deleted_at" IS NULL)
    LEFT OUTER JOIN "default_attributes" AS "form_attributes->default_attribute" ON "form_attributes"."default_attribute_id" = "form_attributes->default_attribute"."id"
    AND (
        "form_attributes->default_attribute"."deleted_at" IS NULL
    )
WHERE
    (
        "forms"."deleted_at" IS NULL
        AND "forms"."is_active" = '1'
    )
ORDER BY "forms"."updated_at" DESC`;

export const formAttributes = `SELECT
    "form_attributes"."id",
    "form_attributes"."name",
    "form_attributes"."column_name" AS "columnName",
    "form_attributes"."mapping_column_id" AS "mappingColumnId",
    "form_attributes"."rank",
    "form_attributes"."screen_type" AS "screenType",
    "form_attributes"."form_id" AS "formId",
    "form_attributes"."default_attribute_id" AS "defaultAttributeId",
    "form_attributes"."properties",
    "form_attributes"."is_required" AS "isRequired",
    "form_attributes"."is_unique" AS "isUnique",
    "form_attributes"."is_null" AS "isNull",
    "form_attributes"."is_active" AS "isActive",
    "form_attributes"."created_by" AS "createdBy",
    "form_attributes"."updated_by" AS "updatedBy",
    "form_attributes"."created_at" AS "createdAt",
    "form_attributes"."updated_at" AS "updatedAt",
    "form"."id" AS "form.id",
    "form"."name" AS "form.name",
    "default_attribute"."id" AS "default_attribute.id",
    "default_attribute"."name" AS "default_attribute.name",
    "default_attribute"."input_type" AS "default_attribute.inputType"
FROM
    "form_attributes" AS "form_attributes"
    LEFT OUTER JOIN "forms" AS "form" ON "form_attributes"."form_id" = "form"."id"
    AND ("form"."deleted_at" IS NULL)
    LEFT OUTER JOIN "default_attributes" AS "default_attribute" ON "form_attributes"."default_attribute_id" = "default_attribute"."id"
    AND ("default_attribute"."deleted_at" IS NULL)
WHERE
    (
        "form_attributes"."deleted_at" IS NULL
        AND (
            "form_attributes"."is_active" = '1'
            AND "form_attributes"."form_id" = 'conditionalId'
        )
    )
ORDER BY
    "form_attributes"."rank" ASC;`;

export const formAttributeValidations = `SELECT
    "attribute_validation_blocks".*,
    "attribute_validation_conditions"."id" AS "attribute_validation_conditions.id",
    "attribute_validation_conditions"."form_attribute_id" AS "attribute_validation_conditions.fromAttributeId",
    "attribute_validation_conditions"."operator_key" AS "attribute_validation_conditions.operatorKey",
    "attribute_validation_conditions"."compare_with_form_attribute_id" AS "attribute_validation_conditions.compareWithFormAttributeId",
    "attribute_validation_conditions"."compare_with_value" AS "attribute_validation_conditions.compareWithValue",
    "attribute_validation_conditions->form_attribute"."id" AS "attribute_validation_conditions.form_attribute.id",
    "attribute_validation_conditions->form_attribute"."name" AS "attribute_validation_conditions.form_attribute.name",
    "attribute_validation_conditions->form_attribute"."column_name" AS "attribute_validation_conditions.form_attribute.columnName",
    "attribute_validation_conditions->compare_with_column"."id" AS "attribute_validation_conditions.compare_with_column.id",
    "attribute_validation_conditions->compare_with_column"."name" AS "attribute_validation_conditions.compare_with_column.name",
    "attribute_validation_conditions->compare_with_column"."column_name" AS "attribute_validation_conditions.compare_with_column.columnName"
FROM
    (
        SELECT
            "attribute_validation_blocks"."id",
            "attribute_validation_blocks"."name",
            "attribute_validation_blocks"."message",
            "attribute_validation_blocks"."type"
        FROM
            "attribute_validation_blocks" AS "attribute_validation_blocks"
        WHERE
            (
                "attribute_validation_blocks"."deleted_at" IS NULL
                AND "attribute_validation_blocks"."primary_column" = 'conditionalId'
            )
        LIMIT
            1
    ) AS "attribute_validation_blocks"
    LEFT OUTER JOIN "attribute_validation_conditions" AS "attribute_validation_conditions" ON "attribute_validation_blocks"."id" = "attribute_validation_conditions"."validation_block_id"
    AND (
        "attribute_validation_conditions"."deleted_at" IS NULL
    )
    LEFT OUTER JOIN "form_attributes" AS "attribute_validation_conditions->form_attribute" ON "attribute_validation_conditions"."form_attribute_id" = "attribute_validation_conditions->form_attribute"."id"
    AND (
        "attribute_validation_conditions->form_attribute"."deleted_at" IS NULL
    )
    LEFT OUTER JOIN "form_attributes" AS "attribute_validation_conditions->compare_with_column" ON "attribute_validation_conditions"."compare_with_form_attribute_id" = "attribute_validation_conditions->compare_with_column"."id"
    AND (
        "attribute_validation_conditions->compare_with_column"."deleted_at" IS NULL
    )`;

export const masterList = `SELECT
    "all_masters_list"."id",
    "all_masters_list"."name",
    "all_masters_list"."visible_name" AS "visibleName",
    "all_masters_list"."access_flag" AS "accessFlag",
    "all_masters_list"."is_master" AS "isMaster",
    "all_masters_list"."parent",
    "all_masters_list"."grand_parent" AS "grandParent",
    "all_masters_list"."parent_rank" AS "parentRank",
    "all_masters_list"."grand_parent_rank" AS "grandParentRank",
    "all_masters_list"."rank",
    "all_masters_list"."grand_parent_id" AS "grandParentId",
    "all_masters_list"."parent_id" AS "parentId",
    "all_masters_list"."table_type" AS "table_type",
    "all_masters_list"."is_active" AS "isActive",
    "all_masters_list"."created_by" AS "createdBy",
    "all_masters_list"."updated_by" AS "updatedBy",
    "all_masters_list"."created_at" AS "createdAt",
    "all_masters_list"."updated_at" AS "updatedAt",
    "parent_info"."id" AS "parent_info.id",
    "parent_info"."name" AS "parent_info.name",
    "parent_info"."visible_name" AS "parent_info.visible_name",
    "parent_info"."rank" AS "parent_info.rank",
    "grand_parent_info"."id" AS "grand_parent_info.id",
    "grand_parent_info"."name" AS "grand_parent_info.name",
    "grand_parent_info"."visible_name" AS "grand_parent_info.visible_name",
    "grand_parent_info"."rank" AS "grand_parent_info.rank"
FROM
    "all_masters_list" AS "all_masters_list"
    LEFT OUTER JOIN "all_masters_list" AS "parent_info" ON "all_masters_list"."parent_id" = "parent_info"."id"
    AND ("parent_info"."deleted_at" IS NULL)
    LEFT OUTER JOIN "all_masters_list" AS "grand_parent_info" ON "all_masters_list"."grand_parent_id" = "grand_parent_info"."id"
    AND ("grand_parent_info"."deleted_at" IS NULL)
WHERE
    "all_masters_list"."id" = 'conditionalId';`;

export const msaterColumns = `SELECT
    "all_master_columns"."id",
    "all_master_columns"."name",
    "all_master_columns"."master_id" AS "masterId",
    "all_master_columns"."visible_name" AS "visibleName",
    "all_master_columns"."is_active" AS "isActive",
    "all_master_columns"."created_by" AS "createdBy",
    "all_master_columns"."updated_by" AS "updatedBy",
    "all_master_columns"."created_at" AS "createdAt",
    "all_master_columns"."updated_at" AS "updatedAt",
    "all_masters_list"."id" AS "all_masters_list.id"
FROM
    "all_master_columns" AS "all_master_columns"
    LEFT OUTER JOIN "all_masters_list" AS "all_masters_list" ON "all_master_columns"."master_id" = "all_masters_list"."id"
    AND ("all_masters_list"."deleted_at" IS NULL)
WHERE
    "all_master_columns"."id" = 'conditionalId';`;

export const getTableName = `SELECT
    "all_masters_list"."name" as "tableName"
FROM
    "all_masters_list" AS "all_masters_list"
    LEFT OUTER JOIN "all_masters_list" AS "parent_info" ON "all_masters_list"."parent_id" = "parent_info"."id"
    AND ("parent_info"."deleted_at" IS NULL)
    LEFT OUTER JOIN "all_masters_list" AS "grand_parent_info" ON "all_masters_list"."grand_parent_id" = "grand_parent_info"."id"
    AND ("grand_parent_info"."deleted_at" IS NULL)
WHERE
    "all_masters_list"."id" = 'conditionalId';`;

export const allMasterColumnlistById = `SELECT
    "all_master_columns"."id",
    "all_master_columns"."name",
    "all_masters_list"."id" AS "all_masters_list.id"
FROM
    "all_master_columns" AS "all_master_columns"
    LEFT OUTER JOIN "all_masters_list" AS "all_masters_list" ON "all_master_columns"."master_id" = "all_masters_list"."id"
    AND ("all_masters_list"."deleted_at" IS NULL)
WHERE
    (
        "all_master_columns"."deleted_at" IS NULL
        AND (
            "all_master_columns"."id" = 'conditionalId'
            AND "all_master_columns"."is_active" = '1'
        )
    );`;

export const getFormMappingTableAndColumn = `SELECT 
    "table_name" AS "tableName",
    "mapping_table_id" AS "mappingTableId",
    "search_columns" AS  "searchColumns",
    "self_search_columns" AS "selfSearchColumns"
FROM 
    forms WHERE id='conditionalId';`;

export const getSearchQueryWithL2Approval = `
    SELECT
        fa.column_name || ' COLLATE NOCASE LIKE ''%' || pmml.id || '%'' AND ' AS subquery
    FROM
        forms
    INNER JOIN form_attributes AS fa ON fa.form_id = forms.id
    INNER JOIN project_master_makers AS pmm ON pmm.project_id = forms.project_id
    INNER JOIN project_master_maker_lovs AS pmml ON pmml.master_id = pmm.id
    WHERE
        forms.table_name = 'conditionalId'
        AND pmml.name = 'Approved'
        AND fa.column_name = 'l_b_approval_status';`;

export const getFormAttributesWithAllMasterColumnsName = `SELECT
    "form_attributes"."id" AS "id",
    "form_attributes"."column_name" AS "columnName",
    "all_master_column"."name" AS "all_master_column.name",
    "all_master_column"."id" AS "all_master_column.id"
FROM
    "form_attributes" AS "form_attributes"
    LEFT OUTER JOIN "all_master_columns" AS "all_master_column" ON "form_attributes"."mapping_column_id" = "all_master_column"."id"
    AND ("all_master_column"."deleted_at" IS NULL)
WHERE
    (
        "form_attributes"."deleted_at" IS NULL
        AND (
            "form_attributes"."is_active" = '1'
            AND "form_attributes"."mapping_column_id" IS NOT NULL
            AND "form_attributes"."form_id" = 'conditaionId'
        )
    );`;

export const visibilityBlockConditions = `SELECT
    "attribute_visibility_blocks"."id",
    "attribute_visibility_blocks"."name",
    "attribute_visibility_blocks"."type",
    replace(replace("attribute_visibility_blocks"."visible_columns", '{', ''), '}', '') AS "visible_columns",
    replace( replace("attribute_visibility_blocks"."non_visible_columns", '{', '') , '}', '') AS "non_visible_columns",
    "attribute_visibility_conditions"."id" AS "attribute_visibility_conditions.id",
    "attribute_visibility_conditions"."form_attribute_id" AS "attribute_visibility_conditions.fromAttributeId",
    "attribute_visibility_conditions"."operator_key" AS "attribute_visibility_conditions.operatorKey",
    "attribute_visibility_conditions"."compare_with_value" AS "attribute_visibility_conditions.compareWithValue",
    "attribute_visibility_conditions->form_attribute"."id" AS "attribute_visibility_conditions.form_attribute.id",
    "attribute_visibility_conditions->form_attribute"."name" AS "attribute_visibility_conditions.form_attribute.name",
    "attribute_visibility_conditions->form_attribute"."column_name" AS "attribute_visibility_conditions.form_attribute.columnName"
FROM
    "attribute_visibility_blocks" AS "attribute_visibility_blocks"
    LEFT OUTER JOIN "attribute_visibility_conditions" AS "attribute_visibility_conditions" ON "attribute_visibility_blocks"."id" = "attribute_visibility_conditions"."visibility_block_id"
    AND (
        "attribute_visibility_conditions"."deleted_at" IS NULL
    )
    LEFT OUTER JOIN "form_attributes" AS "attribute_visibility_conditions->form_attribute" ON "attribute_visibility_conditions"."form_attribute_id" = "attribute_visibility_conditions->form_attribute"."id"
    AND (
        "attribute_visibility_conditions->form_attribute"."deleted_at" IS NULL
    )
WHERE
    (
        "attribute_visibility_blocks"."deleted_at" IS NULL
        AND (
            "attribute_visibility_blocks"."is_active" = '1'
            AND "attribute_visibility_blocks"."form_id" = 'conditionalId'
        )
    );`;

export const getMappingDataDetailsForDynamicMasters = `
        SELECT
            mapper.table_name AS mapping_table,
            mapper_att.column_name AS mapping_column,
            form_att.column_name AS key_name
        FROM
            forms
            INNER JOIN forms AS mapper ON mapper.id = forms.mapping_table_id
            INNER JOIN form_attributes AS mapper_att ON mapper_att.form_id = mapper.id
            INNER JOIN form_attributes AS form_att ON form_att.mapping_column_id = mapper_att.id AND forms.id = form_att.form_id
        WHERE
            forms.id = 'conditionalId'
`;

export const formPermissions = `
    SELECT * FROM form_permissions;
`;

export const formSubtypes = `
SELECT 
    mml.id AS id, mml.name AS name, COUNT(mml.name) AS count
FROM 
    master_maker_lovs AS mml
INNER JOIN 
    forms AS f 
ON 
    f.form_type_id=mml.id
INNER JOIN 
    form_permissions AS fp 
ON 
    fp.id = f.id
GROUP BY 
    mml.name, mml.id
`;

export const formNotifications = `
    SELECT
        "forms_notifications"."id",
        "forms_notifications"."project_id" AS "projectId",
        "forms_notifications"."category",
        "forms_notifications"."is_read" AS "isRead",
        "forms_notifications"."form_id" AS "formId",
        "forms_notifications"."response_id" AS "responseId",
        "forms_notifications"."ticket_id" AS "ticketId",
        "forms_notifications"."user_id" AS "userId",
        "forms_notifications"."created_by" AS "createdBy",
        "forms_notifications"."updated_by" AS "updatedBy",
        "forms_notifications"."created_at" AS "createdAt",
        "forms_notifications"."updated_at" AS "updatedAt",
        "users"."id" AS "users.id",
        "users"."name" AS "users.name",
        "project"."id" AS "project.id",
        "project"."name" AS "project.name",
        "form"."id" AS "form.id",
        "form"."name" AS "form.name",
        "form"."form_type_id" AS "form.formTypeId",
        "ticket"."id" AS "ticket.id",
        "ticket"."project_id" AS "ticket.projectId",
        "ticket"."form_id" AS "ticket.formId",
        "ticket"."ticket_number" AS "ticket.ticketNumber",
        "ticket"."response_id" AS "ticket.responseId",
        "ticket"."issue_id" AS "ticket.issueId",
        "ticket"."issue_sub_id" AS "ticket.subIssueId",
        "ticket"."assignee_type" AS "ticket.assigneeType",
        "ticket"."assign_by" AS "ticket.assignBy",
        "ticket"."supervisor_id" AS "ticket.supervisorId",
        "ticket"."attachments" AS "ticket.attachments",
        "ticket"."assignee_id" AS "ticket.assigneeId",
        "ticket"."description" AS "ticket.description",
        "ticket"."ticket_status" AS "ticket.ticketStatus",
        "ticket"."mobile_number" AS "ticket.mobileNumber",
        "ticket"."remarks" AS "ticket.remarks",
        "ticket"."assignee_remarks" AS "ticket.assigneeRemarks",
        "ticket"."project_wise_mapping_id" AS "ticket.projectWiseMappingId",
        "ticket"."form_wise_mapping_id" AS "ticket.formWiseMappingId",
        "ticket"."escalation" AS "ticket.escalation",
        "ticket"."priority" AS "ticket.priority",
        "ticket"."is_active" AS "ticket.isActive",
        "ticket"."created_by" AS "ticket.createdBy",
        "ticket"."updated_by" AS "ticket.updatedBy",
        "ticket"."created_at" AS "ticket.createdAt",
        "ticket"."updated_at" AS "ticket.updatedAt",
        "ticket"."deleted_at" AS "ticket.deletedAt",
        "ticket"."form_id" AS "ticket.form_id",
        "ticket"."issue_sub_id" AS "ticket.issue_sub_id",
        "ticket"."issue_id" AS "ticket.issue_id",
        "ticket"."project_id" AS "ticket.project_id",
        "ticket"."supervisor_id" AS "ticket.supervisor_id",
        "ticket"."assignee_id" AS "ticket.assignee_id",
        "ticket"."created_by" AS "ticket.created_by",
        "ticket"."updated_by" AS "ticket.updated_by",
        "ticket->form_wise_ticket_mapping"."id" AS "ticket.form_wise_ticket_mapping.id",
        "ticket->form_wise_ticket_mapping"."mobile_fields" AS "ticket.form_wise_ticket_mapping.mobileFields",
        "ticket->form_wise_ticket_mapping"."geo_location_field" AS "ticket.form_wise_ticket_mapping.geoLocationField",
        "ticket->project_wise_ticket_mapping"."id" AS "ticket.project_wise_ticket_mapping.id",
        "ticket->project_wise_ticket_mapping"."forms" AS "ticket.project_wise_ticket_mapping.forms",
        "ticket->project_wise_ticket_mapping"."prefix" AS "ticket.project_wise_ticket_mapping.prefix",
        "createdByUser"."id" AS "createdByUser.id",
        "createdByUser"."name" AS "createdByUser.name",
        "updatedByUser"."id" AS "updatedByUser.id",
        "updatedByUser"."name" AS "updatedByUser.name"
    FROM
        "forms_notifications" AS "forms_notifications"
        LEFT OUTER JOIN "users" AS "users" ON "forms_notifications"."user_id" = "users"."id"
        AND ("users"."deleted_at" IS NULL)
        LEFT OUTER JOIN "projects" AS "project" ON "forms_notifications"."project_id" = "project"."id"
        AND ("project"."deleted_at" IS NULL)
        LEFT OUTER JOIN "forms" AS "form" ON "forms_notifications"."form_id" = "form"."id"
        AND ("form"."deleted_at" IS NULL)
        LEFT OUTER JOIN "tickets" AS "ticket" ON "forms_notifications"."ticket_id" = "ticket"."id"
        AND ("ticket"."deleted_at" IS NULL)
        LEFT OUTER JOIN "form_wise_ticket_mappings" AS "ticket->form_wise_ticket_mapping" ON "ticket"."form_wise_mapping_id" = "ticket->form_wise_ticket_mapping"."id"
        AND (
            "ticket->form_wise_ticket_mapping"."deleted_at" IS NULL
        )
        LEFT OUTER JOIN "project_wise_ticket_mappings" AS "ticket->project_wise_ticket_mapping" ON "ticket"."project_wise_mapping_id" = "ticket->project_wise_ticket_mapping"."id"
        AND (
            "ticket->project_wise_ticket_mapping"."deleted_at" IS NULL
        )
        LEFT OUTER JOIN "users" AS "createdByUser" ON "forms_notifications"."created_by" = "createdByUser"."id"
        AND ("createdByUser"."deleted_at" IS NULL)
        LEFT OUTER JOIN "users" AS "updatedByUser" ON "forms_notifications"."updated_by" = "updatedByUser"."id"
        AND ("updatedByUser"."deleted_at" IS NULL)
    WHERE
        "forms_notifications"."user_id" = 'where_condition'
    ORDER BY
        "createdAt" DESC;
`;

export const unreadNotificationsCount = `
    SELECT
        count(*) AS "count"
    FROM
        "forms_notifications" AS "forms_notifications"
    WHERE
        "forms_notifications"."user_id" = 'where_condition'
        AND "forms_notifications"."is_read" = false;
`;

export const formNotificationsCount = `
    SELECT
        count("forms_notifications"."id") AS "count"
    FROM
        "forms_notifications" AS "forms_notifications"
        LEFT OUTER JOIN "users" AS "users" ON "forms_notifications"."user_id" = "users"."id"
        AND ("users"."deleted_at" IS NULL)
        LEFT OUTER JOIN "projects" AS "project" ON "forms_notifications"."project_id" = "project"."id"
        AND ("project"."deleted_at" IS NULL)
        LEFT OUTER JOIN "forms" AS "form" ON "forms_notifications"."form_id" = "form"."id"
        AND ("form"."deleted_at" IS NULL)
        LEFT OUTER JOIN "tickets" AS "ticket" ON "forms_notifications"."ticket_id" = "ticket"."id"
        AND ("ticket"."deleted_at" IS NULL)
        LEFT OUTER JOIN "form_wise_ticket_mappings" AS "ticket->form_wise_ticket_mapping" ON "ticket"."form_wise_mapping_id" = "ticket->form_wise_ticket_mapping"."id"
        AND (
            "ticket->form_wise_ticket_mapping"."deleted_at" IS NULL
        )
        LEFT OUTER JOIN "project_wise_ticket_mappings" AS "ticket->project_wise_ticket_mapping" ON "ticket"."project_wise_mapping_id" = "ticket->project_wise_ticket_mapping"."id"
        AND (
            "ticket->project_wise_ticket_mapping"."deleted_at" IS NULL
        )
        LEFT OUTER JOIN "users" AS "createdByUser" ON "forms_notifications"."created_by" = "createdByUser"."id"
        AND ("createdByUser"."deleted_at" IS NULL)
        LEFT OUTER JOIN "users" AS "updatedByUser" ON "forms_notifications"."updated_by" = "updatedByUser"."id"
        AND ("updatedByUser"."deleted_at" IS NULL)
    WHERE
        "forms_notifications"."user_id" = 'where_condition'
    GROUP BY "forms_notifications"."id";
`;

export const getFormDetails = `
    SELECT
        "forms"."id",
        "forms"."name",
        "forms"."integration_id" AS "integrationId",
        "forms"."table_name" AS "tableName",
        "forms"."search_columns" AS "searchColumns",
        "forms"."self_search_columns" AS "selfSearchColumns",
        "forms"."mapping_table_id" AS "mappingTableId",
        "forms"."total_counts" AS "totalCounts",
        "forms"."approved_counts" AS "approvedCounts",
        "forms"."rejected_counts" AS "rejectedCounts",
        "forms"."is_published" AS "isPublished",
        "forms"."sequence",
        "forms"."project_id" AS "projectId",
        "forms"."form_type_id" AS "formTypeId",
        "forms"."remarks",
        "forms"."is_active" AS "isActive",
        "forms"."created_by" AS "createdBy",
        "forms"."updated_by" AS "updatedBy",
        "forms"."created_at" AS "createdAt",
        "forms"."updated_at" AS "updatedAt",
        "forms"."properties",
        "project"."id" AS "project.id",
        "project"."name" AS "project.name",
        "project"."code" AS "project.code",
        "master_maker_lov"."id" AS "master_maker_lov.id",
        "master_maker_lov"."name" AS "master_maker_lov.name",
        "form_attributes"."id" AS "form_attributes.id",
        "form_attributes"."name" AS "form_attributes.name",
        "form_attributes"."column_name" AS "form_attributes.columnName",
        "form_attributes"."mapping_column_id" AS "form_attributes.mappingColumnId",
        "form_attributes"."rank" AS "form_attributes.rank",
        "form_attributes"."screen_type" AS "form_attributes.screenType",
        "form_attributes"."properties" AS "form_attributes.properties",
        "form_attributes"."form_id" AS "form_attributes.formId",
        "form_attributes"."default_attribute_id" AS "form_attributes.defaultAttributeId",
        "form_attributes"."is_required" AS "form_attributes.isRequired",
        "form_attributes"."is_unique" AS "form_attributes.isUnique",
        "form_attributes"."is_null" AS "form_attributes.isNull",
        "form_attributes"."is_active" AS "form_attributes.isActive",
        "form_attributes"."created_by" AS "form_attributes.createdBy",
        "form_attributes"."updated_by" AS "form_attributes.updatedBy",
        "form_attributes"."created_at" AS "form_attributes.createdAt",
        "form_attributes"."updated_at" AS "form_attributes.updatedAt",
        "form_attributes"."deleted_at" AS "form_attributes.deletedAt",
        "form_attributes"."mapping_column_id" AS "form_attributes.mapping_column_id",
        "form_attributes"."default_attribute_id" AS "form_attributes.default_attribute_id",
        "form_attributes"."form_id" AS "form_attributes.form_id",
        "form_attributes->default_attribute"."id" AS "form_attributes.default_attribute.id",
        "form_attributes->default_attribute"."integration_id" AS "form_attributes.default_attribute.integrationId",
        "form_attributes->default_attribute"."name" AS "form_attributes.default_attribute.name",
        "form_attributes->default_attribute"."rank" AS "form_attributes.default_attribute.rank",
        "form_attributes->default_attribute"."type" AS "form_attributes.default_attribute.type",
        "form_attributes->default_attribute"."validation" AS "form_attributes.default_attribute.validation",
        "form_attributes->default_attribute"."is_active" AS "form_attributes.default_attribute.isActive",
        "form_attributes->default_attribute"."created_by" AS "form_attributes.default_attribute.createdBy",
        "form_attributes->default_attribute"."updated_by" AS "form_attributes.default_attribute.updatedBy",
        "form_attributes->default_attribute"."input_type" AS "form_attributes.default_attribute.inputType",
        "form_attributes->default_attribute"."created_at" AS "form_attributes.default_attribute.createdAt",
        "form_attributes->default_attribute"."updated_at" AS "form_attributes.default_attribute.updatedAt",
        "form_attributes->default_attribute"."deleted_at" AS "form_attributes.default_attribute.deletedAt",
        "form_attributes->default_attribute"."default_value" AS "form_attributes.default_attribute.defaultValue"
    FROM
        "forms" AS "forms"
        LEFT OUTER JOIN "projects" AS "project" ON "forms"."project_id" = "project"."id"
        AND ("project"."deleted_at" IS NULL)
        LEFT OUTER JOIN "master_maker_lovs" AS "master_maker_lov" ON "forms"."form_type_id" = "master_maker_lov"."id"
        AND ("master_maker_lov"."deleted_at" IS NULL)
        LEFT OUTER JOIN "form_attributes" AS "form_attributes" ON "forms"."id" = "form_attributes"."form_id"
        AND ("form_attributes"."deleted_at" IS NULL)
        LEFT OUTER JOIN "default_attributes" AS "form_attributes->default_attribute" ON "form_attributes"."default_attribute_id" = "form_attributes->default_attribute"."id"
        AND (
            "form_attributes->default_attribute"."deleted_at" IS NULL
        )
    WHERE
        "forms"."id" = 'where_condition';
`;

export const getFormDetailsForTickets = `
    SELECT
        "forms"."id",
        "forms"."name",
        "forms"."integration_id" AS "integrationId",
        "forms"."table_name" AS "tableName",
        "forms"."search_columns" AS "searchColumns",
        "forms"."self_search_columns" AS "selfSearchColumns",
        "forms"."mapping_table_id" AS "mappingTableId",
        "forms"."total_counts" AS "totalCounts",
        "forms"."approved_counts" AS "approvedCounts",
        "forms"."rejected_counts" AS "rejectedCounts",
        "forms"."is_published" AS "isPublished",
        "forms"."sequence",
        "forms"."project_id" AS "projectId",
        "forms"."form_type_id" AS "formTypeId",
        "forms"."remarks",
        "forms"."is_active" AS "isActive",
        "forms"."created_by" AS "createdBy",
        "forms"."updated_by" AS "updatedBy",
        "forms"."created_at" AS "createdAt",
        "forms"."updated_at" AS "updatedAt",
        "forms"."properties",
        "project"."id" AS "project.id",
        "project"."name" AS "project.name",
        "project"."code" AS "project.code",
        "master_maker_lov"."id" AS "master_maker_lov.id",
        "master_maker_lov"."name" AS "master_maker_lov.name",
        "form_attributes"."id" AS "form_attributes.id",
        "form_attributes"."name" AS "form_attributes.name",
        "form_attributes"."column_name" AS "form_attributes.columnName",
        "form_attributes"."mapping_column_id" AS "form_attributes.mappingColumnId",
        "form_attributes"."rank" AS "form_attributes.rank",
        "form_attributes"."screen_type" AS "form_attributes.screenType",
        "form_attributes"."properties" AS "form_attributes.properties",
        "form_attributes"."form_id" AS "form_attributes.formId",
        "form_attributes"."default_attribute_id" AS "form_attributes.defaultAttributeId",
        "form_attributes"."is_required" AS "form_attributes.isRequired",
        "form_attributes"."is_unique" AS "form_attributes.isUnique",
        "form_attributes"."is_null" AS "form_attributes.isNull",
        "form_attributes"."is_active" AS "form_attributes.isActive",
        "form_attributes"."created_by" AS "form_attributes.createdBy",
        "form_attributes"."updated_by" AS "form_attributes.updatedBy",
        "form_attributes"."created_at" AS "form_attributes.createdAt",
        "form_attributes"."updated_at" AS "form_attributes.updatedAt",
        "form_attributes"."deleted_at" AS "form_attributes.deletedAt",
        "form_attributes"."mapping_column_id" AS "form_attributes.mapping_column_id",
        "form_attributes"."default_attribute_id" AS "form_attributes.default_attribute_id",
        "form_attributes"."form_id" AS "form_attributes.form_id",
        "form_attributes->default_attribute"."id" AS "form_attributes.default_attribute.id",
        "form_attributes->default_attribute"."integration_id" AS "form_attributes.default_attribute.integrationId",
        "form_attributes->default_attribute"."name" AS "form_attributes.default_attribute.name",
        "form_attributes->default_attribute"."rank" AS "form_attributes.default_attribute.rank",
        "form_attributes->default_attribute"."type" AS "form_attributes.default_attribute.type",
        "form_attributes->default_attribute"."validation" AS "form_attributes.default_attribute.validation",
        "form_attributes->default_attribute"."is_active" AS "form_attributes.default_attribute.isActive",
        "form_attributes->default_attribute"."created_by" AS "form_attributes.default_attribute.createdBy",
        "form_attributes->default_attribute"."updated_by" AS "form_attributes.default_attribute.updatedBy",
        "form_attributes->default_attribute"."input_type" AS "form_attributes.default_attribute.inputType",
        "form_attributes->default_attribute"."created_at" AS "form_attributes.default_attribute.createdAt",
        "form_attributes->default_attribute"."updated_at" AS "form_attributes.default_attribute.updatedAt",
        "form_attributes->default_attribute"."deleted_at" AS "form_attributes.default_attribute.deletedAt",
        "form_attributes->default_attribute"."default_value" AS "form_attributes.default_attribute.defaultValue"
    FROM
        "forms" AS "forms"
        LEFT OUTER JOIN "projects" AS "project" ON "forms"."project_id" = "project"."id"
        AND ("project"."deleted_at" IS NULL)
        LEFT OUTER JOIN "master_maker_lovs" AS "master_maker_lov" ON "forms"."form_type_id" = "master_maker_lov"."id"
        AND ("master_maker_lov"."deleted_at" IS NULL)
        LEFT OUTER JOIN "form_attributes" AS "form_attributes" ON "forms"."id" = "form_attributes"."form_id"
        AND ("form_attributes"."deleted_at" IS NULL)
        LEFT OUTER JOIN "default_attributes" AS "form_attributes->default_attribute" ON "form_attributes"."default_attribute_id" = "form_attributes->default_attribute"."id"
        AND (
            "form_attributes->default_attribute"."deleted_at" IS NULL
        )
    WHERE
        "forms"."id" = 'where_condition';
`;

export const getFormWithInFormIds = `
    SELECT
        "id",
        "name"
    FROM
        "forms" AS "forms"
    WHERE
        (
            "forms"."deleted_at" IS NULL
            AND (
                "forms"."id" IN (
                    'where_condition'
                )
                AND "forms"."is_active" = '1'
            )
        );
`;

export const getFormAttForTickets = `
    SELECT
        "id",
        "name",
        "column_name" AS "columnName"
    FROM
        "form_attributes" AS "form_attributes"
    WHERE
        (
            "form_attributes"."deleted_at" IS NULL
            AND (
                (
                    "form_attributes"."id" IN (
                        'where_condition'
                    )
                    OR "form_attributes"."id" IS NULL
                )
                AND "form_attributes"."is_active" = '1'
            )
        );
`;

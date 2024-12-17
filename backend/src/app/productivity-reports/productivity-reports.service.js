const statusCodes = require("../../config/status-codes");
const statusMessage = require("../../config/status-message");
const Forms = require("../../database/operation/forms");
const { throwError } = require("../../services/throw-error-class");
const { getFormDetails } = require("../forms/forms.service");

function formatForInClause(columnValues) {
    const columnValueString = columnValues.map((val) => `'${val}'`).join(", ");
    return columnValueString;
}

const getUserWiseReport = async (req) => {
    const { formId, dateFrom, dateTo, gaaHierarchy, sort, pageNumber, rowPerPage } = req.query;
    const columnValue = formatForInClause(gaaHierarchy.columnValue);
    
    const getformDetails = await getFormDetails(formId);

    const getFormUsersData = await getUserWiseInstallerDetails(getformDetails, dateFrom, dateTo, gaaHierarchy.columnName, columnValue, sort, { pageNumber, rowPerPage });

    return { data: { count: getFormUsersData?.formDetailsCount?.count,
        rows: getFormUsersData?.getFormUsersDetails } };
};

// Used to get the form vise Form Response.
// eslint-disable-next-line default-param-last
const getUserWiseInstallerDetails = async (getformDetails, dateTimeFrom, dateTimeTo, columnName, columnValue, sort, paginate = { pageNumber: 1, rowPerPage: 25 }) => {
    try {
        const { db } = new Forms();
        const basicDetailQuery = `
            SELECT
                "Form Response"."created_by" AS "Installer ID",
                "Installer"."name" AS "Installer Name",
                CAST("Form Response"."created_at" AS DATE) AS "Created At",
                COUNT(1) AS "Task Completed",
                COALESCE(SUM(("L1 Approval Status"."name" IS NULL)::INT), 0) AS "L1 Approval Pending",
                COALESCE(SUM(("L2 Approval Status"."name" IS NULL)::INT), 0) AS "L2 Approval Pending",
                COALESCE(SUM(("L1 Approval Status"."name" = 'Approved')::INT), 0) AS "L1 Approved",
                COALESCE(SUM(("L2 Approval Status"."name" = 'Approved')::INT), 0) AS "L2 Approved",
                COALESCE(SUM(("L1 Approval Status"."name" = 'Rejected')::INT), 0) AS "L1 Rejected",
                COALESCE(SUM(("L2 Approval Status"."name" = 'Rejected')::INT), 0) AS "L2 Rejected",
                COALESCE(SUM(("L1 Approval Status"."name" = 'On-Hold')::INT), 0) AS "L1 On-Hold",
                COALESCE(SUM(("L2 Approval Status"."name" = 'On-Hold')::INT), 0) AS "L2 On-Hold",
                MIN(
                    "Form Response"."created_at"
                ) AS "Execution Started At",
                MAX(
                    "Form Response"."created_at"
                ) AS "Execution Ended At"
            FROM
                ${getformDetails.tableName} AS "Form Response"
                LEFT JOIN "public"."project_master_maker_lovs" AS "L1 Approval Status" ON "Form Response"."l_a_approval_status"[1] = "L1 Approval Status"."id"
                LEFT JOIN "public"."project_master_maker_lovs" AS "L2 Approval Status" ON "Form Response"."l_b_approval_status"[1] = "L2 Approval Status"."id"
                INNER JOIN "public"."users" AS "Installer" ON "Form Response"."created_by" = "Installer"."id"
            WHERE
                1=1
                ${dateTimeFrom ? `AND "Form Response"."created_at" >= '${dateTimeFrom}'` : ""}
                ${dateTimeTo ? `AND "Form Response"."created_at" <= '${dateTimeTo}'` : ""}
                ${columnValue ? `AND "Form Response".${columnName}[1] IN (${columnValue})` : ""}
                
            GROUP BY
                "Form Response"."created_by",
                "Installer"."name",
                CAST("Form Response"."created_at" AS DATE)
        `;
        
        const pagination = (paginate) ? `OFFSET ${(paginate.pageNumber - 1) * paginate.rowPerPage} LIMIT ${paginate.rowPerPage}` : "";
        
        const GroupaUserCount = `
            SELECT COUNT(*)
                FROM (
                    SELECT
                        "Form Response"."Installer ID" AS "Installer ID",
                        "Form Response"."Installer Name" AS "Installer Name",
                        "Form Response"."Created At" AS "Created At",
                        SUM("Form Response"."Task Completed") AS "Task Completed",
                        SUM("Form Response"."L1 Approval Pending") AS "L1 Approval Pending",
                        SUM("Form Response"."L2 Approval Pending") AS "L2 Approval Pending",
                        SUM("Form Response"."L1 Approved") AS "L1 Approved",
                        SUM("Form Response"."L2 Approved") AS "L2 Approved",
                        SUM("Form Response"."L1 Rejected") AS "L1 Rejected",
                        SUM("Form Response"."L2 Rejected") AS "L2 Rejected",
                        SUM("Form Response"."L1 On-Hold") AS "L1 On-Hold",
                        SUM("L2 On-Hold") AS "L2 On-Hold",
                        MIN("Form Response"."Execution Started At") AS "Execution Started At",
                        MAX("Form Response"."Execution Ended At") AS "Execution Ended At",
                        EXTRACT(
                            HOUR
                            FROM
                                (
                                    MAX("Form Response"."Execution Ended At") - MIN("Form Response"."Execution Started At")
                                )
                        ) || ' Hours ' || EXTRACT(
                            minute
                            FROM
                                (
                                    MAX("Form Response"."Execution Ended At") - MIN("Form Response"."Execution Started At")
                                )
                        ) || ' Minutes' as "Total Working Hours"
                    FROM
                        (
                            ${basicDetailQuery}
                        ) AS "Form Response"
                    GROUP BY
                        "Installer ID",
                        "Installer Name",
                        "Created At"
                    ORDER BY
                        ${sort ? `"${(sort[0].charAt(0).toUpperCase() + sort[0].slice(1)).replace(/([A-Z])/g, " $1").trim()}" ${sort[1]}` : '"Created At" ASC'}
            ) AS aggregated_results
        `;
        const GroupaUser = `
            SELECT
                "Form Response"."Installer ID" AS "Installer ID",
                "Form Response"."Installer Name" AS "Installer Name",
                "Form Response"."Created At" AS "Created At",
                SUM("Form Response"."Task Completed") AS "Task Completed",
                SUM("Form Response"."L1 Approval Pending") AS "L1 Approval Pending",
                SUM("Form Response"."L2 Approval Pending") AS "L2 Approval Pending",
                SUM("Form Response"."L1 Approved") AS "L1 Approved",
                SUM("Form Response"."L2 Approved") AS "L2 Approved",
                SUM("Form Response"."L1 Rejected") AS "L1 Rejected",
                SUM("Form Response"."L2 Rejected") AS "L2 Rejected",
                SUM("Form Response"."L1 On-Hold") AS "L1 On-Hold",
                SUM("L2 On-Hold") AS "L2 On-Hold",
                MIN("Form Response"."Execution Started At") AS "Execution Started At",
                MAX("Form Response"."Execution Ended At") AS "Execution Ended At",
                EXTRACT(
                    HOUR
                    FROM
                        (
                            MAX("Form Response"."Execution Ended At") - MIN("Form Response"."Execution Started At")
                        )
                ) || ' Hours ' || EXTRACT(
                    minute
                    FROM
                        (
                            MAX("Form Response"."Execution Ended At") - MIN("Form Response"."Execution Started At")
                        )
                ) || ' Minutes' as "Total Working Hours"
            FROM
                (
                    ${basicDetailQuery}
                ) AS "Form Response"
            GROUP BY
                "Installer ID",
                "Installer Name",
                "Created At"
            ORDER BY
                ${sort ? `"${(sort[0].charAt(0).toUpperCase() + sort[0].slice(1)).replace(/([A-Z])/g, " $1").trim()}" ${sort[1]}` : '"Created At" ASC'}
            ${pagination}
        `;

        const formDetails = await db.sequelize.selectQuery(GroupaUser, {
            type: db.sequelize.QueryTypes.SELECT
        });
        
        const getFormUsersDetails = formDetails.map((row) => ({
            ...row,
            projectName: getformDetails.project,
            formName: getformDetails.form,
            formTypeName: getformDetails.form_type_name
        }));
        
        if (pagination) {
            const [formDetailsCount] = await db.sequelize.selectQuery(GroupaUserCount, {
                type: db.sequelize.QueryTypes.SELECT
            });
            return { formDetailsCount, getFormUsersDetails };
        } else {
            return { getFormUsersDetails };
        }

    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessage.NO_DATA_FOUND_COLUMN, "No Data in the forms.");
    }
      
};

module.exports = {
    getUserWiseReport,
    getUserWiseInstallerDetails,
    formatForInClause
};
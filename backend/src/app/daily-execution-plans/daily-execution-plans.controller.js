const Excel = require("excel4node");
const XLSX = require("xlsx");
const statusCodes = require("../../config/status-codes");
const { throwIfNot } = require("../../services/throw-error-class");
const dailyExecutionPlanService = require("./daily-execution-plans.service");
const DailyExecutionPlans = require("../../database/operation/daily-execution-plans");
const { getProjectByCondition } = require("../projects/projects.service");
const { getMasterMakerLovByCondition } = require("../master-maker-lovs/master-maker-lovs.service");

const dailyExecutionPlansSchema = async () => {
    const schema = [
        { column_name: "month", name: null, column_type: "integer", type: "integer-mandatory" },
        { column_name: "year", name: null, column_type: "integer", type: "integer-mandatory" }
    ];
    for (let i = 1; i <= 31; i++) {
        schema.push({ column_name: `q${i}`, name: null, column_type: "double precision", type: "number/null" });
    }
    return schema;
};

const exportDailyExecutionPlanSchemaFile = async (req, res) => {
    const { projectId, materialTypeId } = req.body;
    const { name: projectName } = await getProjectByCondition({ id: projectId });
    const { name: materialTypeName } = await getMasterMakerLovByCondition({ id: materialTypeId });
    const sheetName = `dep-${projectName.replaceAll("/", "_")}-${materialTypeName.replaceAll("/", "_")}`;
    const dailyExecutionPlanSchema = await dailyExecutionPlansSchema();

    const { db } = new DailyExecutionPlans();
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    const columnNames = dailyExecutionPlanSchema.map((row) => row.column_name);
    const dataTypes = dailyExecutionPlanSchema.map((row) => row.type);
    const distinctNonNullNames = [...new Set(dailyExecutionPlanSchema.filter((item) => item.name !== null).map((item) => item.name))];
    distinctNonNullNames.push("existing_entries");

    const headerStyle = workbook.createStyle({
        font: {
            color: "00a9ff",
            bold: true
        }
    });

    const boldStyle = workbook.createStyle({
        font: {
            bold: true,
            size: 10
        }
    });

    columnNames.forEach((name, colNumber) => {
        worksheet.cell(1, colNumber + 1)
            .string(name)
            .style(headerStyle);
    });

    dataTypes.forEach((type, colNumber) => {
        worksheet.cell(2, colNumber + 1)
            .string(type)
            .style(boldStyle);
    });

    const queryPromises = distinctNonNullNames?.map(async (tableName) => {
        const tableSheet = workbook.addWorksheet(tableName);

        // Query the data for the current table name
        let tableDataSql;
        if (tableName === "existing_entries") {
            tableDataSql = `SELECT month, year, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, q26, q27, q28, q29, q30, q31 FROM daily_execution_plans WHERE project_id = '${projectId}' AND material_type_id = '${materialTypeId}' AND is_active = '1' ORDER BY year ASC, month ASC`;
        }

        const [tableQueryData] = await db.sequelize.selectQuery(tableDataSql);
  
        // Insert the header row with the column names
        const tableColumnNames = tableQueryData.length > 0 ? Object.keys(tableQueryData?.[0]) : [];
        tableColumnNames?.forEach((name, colNumber) => {
            tableSheet.cell(1, colNumber + 1)
                .string(name)
                .style(headerStyle);
        });
    
        tableQueryData?.forEach((row, rowIndex) => {
            tableColumnNames.forEach((colName, colIndex) => {
                const cellValue = row[colName];
                if (cellValue !== null) {
                    tableSheet.cell(rowIndex + 2, colIndex + 1)
                        .string(cellValue.toString());
                } else {
                    tableSheet.cell(rowIndex + 2, colIndex + 1)
                        .string("null");
                }
            });
        });
    });

    await Promise.all(queryPromises);

    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader("Content-Disposition", `attachment; filename=${sheetName}.xlsx`);

    workbook.writeToBuffer().then((buffer) => {
        res.end(buffer);
    });
};

const processExcelErrors = async (errorArr, columnNames, sheetName) => {
    const errorColumns = [...columnNames, "remarks"];
    const errorWorkbook = new Excel.Workbook();
    const errorWorksheet = errorWorkbook.addWorksheet(sheetName);
    const headerStyle = errorWorkbook.createStyle({ font: { color: "#00a9ff", bold: true } });
    const createGreenFontStyle = () => errorWorkbook.createStyle({ font: { color: "#006200" } });
    const createRedFontStyle = () => errorWorkbook.createStyle({ font: { color: "#ff0000" } });
    
    errorColumns.forEach((name, colNumber) => {
        errorWorksheet.cell(1, colNumber + 1).string(name).style(headerStyle);
    });

    // Add your data to the worksheet
    errorArr.forEach((row, rowNum) => {
        errorColumns.forEach((name, colNumber) => {
            const cell = errorWorksheet.cell(rowNum + 2, colNumber + 1);
            if (name === "remarks") {
                cell.string(row[name]);
                cell.style(row[name] === "Success" ? createGreenFontStyle() : createRedFontStyle());
            } else if (typeof row[name] === "number") {
                cell.number(row[name]);
            } else if (row[name] === null) {
                cell.string("null");
            } else if (row[name] === undefined) {
                cell.string("");
            } else {
                cell.string(row[name]);
            }
        });
    });

    let bufferData;
    const isErrorExists = errorArr?.length && errorArr.filter((obj) => obj.remarks !== "Success");
    if (isErrorExists?.length) {
        bufferData = await errorWorkbook.writeToBuffer();
        return {
            buffer: bufferData,
            contentType: "application/vnd.openxmlformats",
            filename: `${sheetName}Error.xlsx`
        };
    }
};

const processExcelFile = async (uploadedFile) => {
    const workbook = XLSX.read(uploadedFile.data, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const columnNames = [];

    const quantityColumns = [
        "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15", "q16", "q17", "q18", "q19", "q20", "q21", "q22", "q23", "q24", "q25", "q26", "q27", "q28", "q29", "q30", "q31"
    ];
    const allColumns = ["month", "year", ...quantityColumns];

    // Get column names from the first row
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = { c: C, r: 0 };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        const columnName = worksheet[cellRef] ? worksheet[cellRef].v : null;
        // Check for empty cells in the header
        if (columnName !== null && columnName !== undefined) {
            columnNames.push(columnName);
        }
    }

    const checkColumnNames = allColumns.every((columnName) => columnNames.includes(columnName));
    throwIfNot(checkColumnNames, statusCodes.NOT_FOUND, "Invalid Data.");

    const errorArr = [];
    const resultArray = [];
    // Extract data rows
    for (let R = 2; R <= range.e.r; ++R) {
        const rowObject = {};
        let skipRow = false;
        let rowRemark = "Success";
        let allCellsEmpty = true;
        columnNames.forEach((columnName, C) => {
            const cellAddress = { c: C, r: R };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            // Check for empty cells
            if (worksheet[cellRef] === undefined) {
                skipRow = true;
                rowRemark = "No empty cell allowed.";
                return; // Exit the loop early if any cell is undefined
            }
            // Get the cell value and trim if it's a string
            let cellValue = worksheet[cellRef].v;
            if (typeof cellValue === "string") {
                cellValue = cellValue.trim();
            }
            // Check if the cell is empty
            if (cellValue !== "") {
                allCellsEmpty = false;
            }
            rowObject[columnName] = cellValue?.toString()?.toLowerCase() === "null" ? null : cellValue;

            if (columnName === "month") {
                const month = parseInt(cellValue);
                if (Number.isNaN(month) || month < 1 || month > 12) {
                    skipRow = true;
                    rowRemark = "Month should between 1 to 12.";
                }
            } else if (columnName === "year") {
                const year = parseInt(cellValue);
                if (Number.isNaN(year) || year < 1900 || year > 2100) {
                    skipRow = true;
                    rowRemark = "Invalid year.";
                }
            } else if (quantityColumns.includes(columnName)) {
                const daysInMonth = new Date(rowObject.year, rowObject.month, 0).getDate();
                if (parseInt(columnName.substring(1)) > daysInMonth && cellValue !== null && cellValue?.toString()?.toLowerCase() !== "null") {
                    skipRow = true;
                    rowRemark = `This month has ${daysInMonth} days. Please enter data correctly.`;
                } else if (cellValue?.toString()?.toLowerCase() !== "null" && (Number.isNaN(parseFloat(cellValue)) || parseFloat(cellValue) < 0 || (/\.\d{4,}/.test(cellValue)))) {
                    skipRow = true;
                    rowRemark = `Invalid ${columnName}.`;
                } else if (quantityColumns.every((columnName) => rowObject[columnName] === null || rowObject[columnName]?.toString()?.toLowerCase() === "null" || parseFloat(rowObject[columnName]) === 0)) {
                    skipRow = true;
                    // rowRemark = "At least one quantity is a valid number and is neither null nor 0";
                    rowRemark = "Please provide atleast one quantity.";
                }
            }
        });
        // Skip row if all cells are empty
        if (!allCellsEmpty) {
            errorArr.push({ ...rowObject, remarks: rowRemark });
        }
        // Check if the row should be skipped
        if (!skipRow) {
            resultArray.push(rowObject);
        }
    }
    return { resultArray, sheetName, columnNames, errorArr };
};

const importDailyExecutionPlan = async (req) => {
    const { user: { userId } } = req;
    const { projectId, materialTypeId } = req.body;
    const uploadedFile = req.files.excelFile;
    const { resultArray, sheetName, columnNames, errorArr } = await processExcelFile(uploadedFile);
    if (resultArray.length > 0) {
        for await (const obj of resultArray) {
            const { month, year } = obj;
            obj.projectId = projectId;
            obj.materialTypeId = materialTypeId;
            obj.updatedBy = userId;
            const isPlanExists = await dailyExecutionPlanService.isDailyExecutionPlanExists({ projectId, materialTypeId, month, year, isActive: "1" });
            if (isPlanExists) {
                await dailyExecutionPlanService.updateDailyExecutionPlan(obj, { projectId, materialTypeId, month, year, isActive: "1" });
            } else {
                obj.createdBy = userId;
                await dailyExecutionPlanService.createDailyExecutionPlan(obj);
            }
        }
    }
    return processExcelErrors(errorArr, columnNames, sheetName);
};

/**
  * Method to get Daily Execution Plan list
  * @param { object } req.body
  * @returns { object } data
  */
const getDailyExecutionPlanList = async (req) => {
    const where = {};
    const { projectId, materialTypeId, month, year } = req.query;
    if (projectId) where.projectId = projectId;
    if (materialTypeId) where.materialTypeId = materialTypeId;
    if (month) where.month = month;
    if (year) where.year = year;
    const data = await dailyExecutionPlanService.getDailyExecutionPlanList(where);
    return { data };
};

/**
  * Method to delete Daily Execution Plan by id
  * @param { object } req.body
  * @returns { object } data
  */
const deleteDailyExecutionPlan = async (req) => {
    const { id } = req.params;
    const data = await dailyExecutionPlanService.deleteDailyExecutionPlan({ id });
    return { data };
};

/**
 * Method to get Daily Execution Plan history
 * @param {object} req 
 * @returns { object } data
 */
const getDailyExecutionPlanHistory = async (req) => {
    const { recordId } = req.params;
    const data = await dailyExecutionPlanService.getDailyExecutionPlanHistory({ recordId });
    return { data };
};

module.exports = {
    exportDailyExecutionPlanSchemaFile,
    importDailyExecutionPlan,
    getDailyExecutionPlanList,
    deleteDailyExecutionPlan,
    getDailyExecutionPlanHistory
};

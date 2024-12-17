const Excel = require("excel4node");
const XLSX = require("xlsx");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { throwIf, throwIfNot, throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const qaMasterMakerLovsService = require("./qa-master-maker-lovs.service");
const { getMappingKeysInArray, validateUUID } = require("../../utilities/common-utils");
const { qaMasterMakerAlreadyExists } = require("../qa-master-makers/qa-master-makers.service");
const QaMasterMakerLovs = require("../../database/operation/qa-master-maker-lovs");
const { masterMakerLovsAlreadyExists } = require("../master-maker-lovs/master-maker-lovs.service");

const mapping = {
    "qa_master_maker_lovs.major_contributor": "majorContributor",
    "qa_master_maker_lovs.code": "code",
    "qa_master_maker_lovs.priority": "priority",
    "qa_master_maker_lovs.defect": "defect",
    "observation_type.name": "observation_type.name",
    "observation_severity.name": "observation_severity.name",
    "updated.name": "updated.name",
    "created.name": "created.name"
};

const filterMapping = {
    majorContributor: "majorContributor",
    code: "code",
    priority: "priority",
    defect: "defect",
    observationType: "$observation_type.name$",
    observationSeverity: "$observation_severity.name$",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

/**
 * Method to create qa master maker lov
 * @param { object } req.body
 * @returns { object } data
 */
const createQaMasterMakerLov = async (req) => {
    const { masterId, majorContributor, code } = req.body;
    const isMajorContributorExists = await qaMasterMakerLovsService.qaMasterMakerLovAlreadyExists({ masterId, majorContributor: { [Op.iLike]: majorContributor } });
    throwIf(isMajorContributorExists, statusCodes.DUPLICATE, statusMessages.QA_MASTER_MAKER_LOV_ALREADY_EXIST);
    const isCodeExists = await qaMasterMakerLovsService.qaMasterMakerLovAlreadyExists({ masterId, code: { [Op.iLike]: code } });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.QA_MASTER_MAKER_LOV_ALREADY_EXIST);
    const data = await qaMasterMakerLovsService.createQaMasterMakerLov(req.body);
    return { data };
};

/**
 * Method to get qa master maker lov list
 * @param { object } req.body
 * @returns { object } data
 */
const getQaMasterMakerLovList = async (req) => {
    const { masterId, searchString, accessors, filterObject } = req.query;
    const filterString = filterObject ? JSON.parse(filterObject) : {};
    const where = { [Op.and]: [] };

    if (searchString && searchString.length > 0) {
        const accessorArray = accessors ? JSON.parse(accessors) : [];
        const keysInArray = getMappingKeysInArray(accessorArray, mapping);
        const castingConditions = [];
        keysInArray.forEach((column) => {
            castingConditions.push([
                sequelize.where(
                    sequelize.cast(sequelize.col(column), "varchar"),
                    { [Op.iLike]: `%${searchString}%` }
                )
            ]);
        });

        // Create an OR condition for all columns
        const orConditions = { [Op.or]: castingConditions };
        where[Op.and].push(orConditions);
    }

    if (filterString && Object.keys(filterString).length > 0) {
        for (const key in filterString) {
            if (filterMapping[key]) {
                const mappedKey = filterMapping[key];
                const filterValue = filterString[key];
    
                // Perform the mapping based on the filterMapping and add to the condition
                const mappedCondition = {
                    [mappedKey]: filterValue
                };
                where[Op.and].push(mappedCondition);
            }
        }
    }

    if (masterId) where[Op.and].push({ masterId });
    const data = await qaMasterMakerLovsService.getQaMasterMakerLovList(where);
    return { data };
};

/**
 * Method to update qa master maker lov
 * @param { object } req.body
 * @returns { object } data
 */
const updateQaMasterMakerLov = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.QA_MASTER_MAKER_LOV_ID_NOT_FOUND);
    const isQaMasterMakerLovExists = await qaMasterMakerLovsService.qaMasterMakerLovAlreadyExists({ id });
    throwIfNot(isQaMasterMakerLovExists, statusCodes.NOT_FOUND, statusMessages.QA_MASTER_MAKER_LOV_NOT_EXIST);
    const { masterId, majorContributor, code } = req.body;
    const isMajorContributorExists = await qaMasterMakerLovsService.qaMasterMakerLovAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: id } }, { masterId, majorContributor: { [Op.iLike]: majorContributor } }] });
    throwIf(isMajorContributorExists, statusCodes.DUPLICATE, statusMessages.QA_MASTER_MAKER_LOV_ALREADY_EXIST);
    const isCodeExists = await qaMasterMakerLovsService.qaMasterMakerLovAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: id } }, { masterId, code: { [Op.iLike]: code } }] });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.QA_MASTER_MAKER_LOV_ALREADY_EXIST);
    const data = await qaMasterMakerLovsService.updateQaMasterMakerLov(req.body, { id });
    return { data };
};

/**
 * Method to delete qa master maker lov by id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteQaMasterMakerLov = async (req) => {
    const { id } = req.params;
    throwIfNot(id, statusCodes.BAD_REQUEST, statusMessages.QA_MASTER_MAKER_LOV_ID_NOT_FOUND);
    const data = await qaMasterMakerLovsService.deleteQaMasterMakerLov({ id });
    return { data };
};

/**
 * Method to get qa master maker lov history
 * @param { object } req.body
 * @returns { object } data
 */
const getQaMasterMakerLovHistory = async (req) => {
    const { recordId } = req.params;
    throwIfNot(recordId, statusCodes.BAD_REQUEST, statusMessages.QA_MASTER_MAKER_LOV_RECORD_ID_NOT_FOUND);
    const data = await qaMasterMakerLovsService.getQaMasterMakerLovHistory({ recordId });
    return { data };
};

const qaMasterMakerLovSchema = [
    {
        column_name: "id",
        name: "existing_entries",
        column_type: "uuid",
        type: "uuid (existing_entries)"
    },
    {
        column_name: "masterId",
        name: "QA_master_maker",
        column_type: "uuid",
        type: "uuid (QA_master_maker)-mandatory"
    },
    {
        column_name: "majorContributor",
        name: null,
        column_type: "character varying",
        type: "text-mandatory"
    },
    {
        column_name: "code",
        name: null,
        column_type: "character varying",
        type: "text-mandatory"
    },
    {
        column_name: "priority",
        name: null,
        column_type: "integer",
        type: "integer-mandatory"
    },
    {
        column_name: "defect",
        name: null,
        column_type: "character varying",
        type: "text-mandatory"
    },
    {
        column_name: "observationTypeId",
        name: "observation_type",
        column_type: "uuid",
        type: "uuid (observation_type)-mandatory"
    },
    {
        column_name: "observationSeverityId",
        name: "observation_severity",
        column_type: "uuid",
        type: "uuid (observation_severity)-mandatory"
    }
];

const qaMasterMakerLovSchemaExport = async (req, res) => {
    const sheetName = "QA_master_maker_lov";
    const { db } = new QaMasterMakerLovs();
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    const columnNames = qaMasterMakerLovSchema.map((row) => row.column_name);
    const dataTypes = qaMasterMakerLovSchema.map((row) => row.type);
    const distinctNonNullNames = [...new Set(qaMasterMakerLovSchema.filter((item) => item.name !== null).map((item) => item.name))];

    const headerStyle = workbook.createStyle({ font: { color: "00a9ff", bold: true } });
    const boldStyle = workbook.createStyle({ font: { bold: true, size: 10 } });

    columnNames.forEach((name, colNumber) => { worksheet.cell(1, colNumber + 1).string(name).style(headerStyle); });
    dataTypes.forEach((type, colNumber) => { worksheet.cell(2, colNumber + 1).string(type).style(boldStyle); });

    const queryPromises = distinctNonNullNames?.map(async (tableName) => {
        const tableSheet = workbook.addWorksheet(tableName);

        // Query the data for the current table name
        let tableDataSql;
        if (tableName === "existing_entries") {
            tableDataSql = "SELECT qmml.id, qmml.master_id AS masterId, qmm.name AS \"Master Name\", qmml.major_contributor AS majorContributor, qmml.code, qmml.priority, qmml.defect, qmml.observation_type_id AS observationTypeId, obtmml.name AS \"Observation Type\", qmml.observation_severity_id AS observationSeverityId, obsmml.name AS \"Observation Severity\" FROM qa_master_maker_lovs AS qmml INNER JOIN qa_master_makers AS qmm ON qmml.master_id = qmm.id INNER JOIN master_maker_lovs AS obtmml ON qmml.observation_type_id = obtmml.id INNER JOIN master_maker_lovs AS obsmml ON qmml.observation_severity_id = obsmml.id WHERE qmml.is_active = '1' ORDER BY qmml.updated_at DESC";
        } else if (tableName === "QA_master_maker") {
            tableDataSql = "SELECT qmm.id AS masterId, qmm.name AS \"Master Name\", p.name AS \"Project Name\", mml.name AS \"QA Meter Type\" FROM qa_master_makers AS qmm INNER JOIN projects AS p ON qmm.project_id = p.id INNER JOIN master_maker_lovs AS mml ON qmm.meter_type_id = mml.id WHERE qmm.is_active = '1' ORDER BY qmm.updated_at DESC";
        } else if (tableName === "observation_type") {
            tableDataSql = "SELECT id AS observationTypeId, name FROM master_maker_lovs WHERE master_id = '4a219c23-9458-410f-a56e-85d7eb7dc4fe' AND is_active = '1' ORDER BY updated_at DESC";
        } else if (tableName === "observation_severity") {
            tableDataSql = "SELECT id AS observationSeverityId, name FROM master_maker_lovs WHERE master_id = '0d6f899e-443d-46d6-a855-d609da7d2bd8' AND is_active = '1' ORDER BY updated_at DESC";
        }

        const [tableQueryData] = await db.sequelize.selectQuery(tableDataSql);
  
        // Insert the header row with the column names
        const tableColumnNames = tableQueryData.length > 0 ? Object.keys(tableQueryData?.[0]) : [];
        tableColumnNames?.forEach((name, colNumber) => { tableSheet.cell(1, colNumber + 1).string(name).style(headerStyle); });
    
        tableQueryData?.forEach((row, rowIndex) => {
            tableColumnNames.forEach((colName, colIndex) => {
                const cellValue = row[colName];
                if (cellValue !== null) {
                    tableSheet.cell(rowIndex + 2, colIndex + 1).string(cellValue.toString());
                } else {
                    tableSheet.cell(rowIndex + 2, colIndex + 1).string("null");
                }
            });
        });
    });

    await Promise.all(queryPromises);

    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader("Content-Disposition", `attachment; filename=${sheetName}.xlsx`);

    workbook.writeToBuffer().then((buffer) => { res.end(buffer); });
};

const processExcelFile = async (uploadedFile) => {
    const workbook = XLSX.read(uploadedFile.data, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    const columnNames = [];
    const requiredColumns = ["masterId", "majorContributor", "code", "priority", "defect", "observationTypeId", "observationSeverityId"];

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

    const requiredColumnCheck = requiredColumns.every((columnName) => columnNames.includes(columnName));
    throwIfNot(requiredColumnCheck, statusCodes.NOT_FOUND, "Invalid Data.");

    const errorArr = [];
    const insertArr = [];
    const updateArr = [];
    const majorContributorMasterIdMap = {};
    const codeMasterIdMap = {};
    for (let R = 2; R <= range.e.r; ++R) {
        const rowObject = {};
        let allCellsEmpty = true;
        let rowRemark;
        columnNames.forEach((columnName, C) => {
            const cellAddress = { c: C, r: R };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            // Check for empty cells
            if ((columnName !== "id" || requiredColumns.includes(columnName)) && worksheet[cellRef] === undefined) {
                rowRemark = "No empty cell allowed";
                return; // Exit the loop early if any cell is undefined
            }
            // Get the cell value and trim if it's a string
            let cellValue = worksheet[cellRef]?.v;
            if (typeof cellValue === "string") {
                cellValue = cellValue.trim();
            }
            // Check if the cell is empty
            if (cellValue && cellValue !== "") {
                allCellsEmpty = false;
            }
            rowObject[columnName] = columnName === "majorContributor" || columnName === "code" ? cellValue?.toString() : cellValue;

            if (columnName === "observationSeverityId" && !validateUUID(cellValue)) {
                rowRemark = "Invalid UUID for observationSeverityId";
            }

            if (columnName === "observationTypeId" && !validateUUID(cellValue)) {
                rowRemark = "Invalid UUID for observationTypeId";
            }

            if (columnName === "priority") {
                const priority = parseInt(cellValue);
                if (Number.isNaN(priority) || priority < 0) {
                    rowRemark = "Priority must be a positive integer";
                }
            }

            if (columnName === "code") {
                const { masterId } = rowObject;
                const codeKey = `${masterId}_${cellValue?.toString()?.toLowerCase()}`;
                if (codeMasterIdMap[codeKey]) {
                    rowRemark = "Duplicate code found for the same masterId";
                } else {
                    codeMasterIdMap[codeKey] = true;
                }
            }

            if (columnName === "majorContributor") {
                const { masterId } = rowObject;
                const majorContributorKey = `${masterId}_${cellValue?.toString()?.toLowerCase()}`;
                if (majorContributorMasterIdMap[majorContributorKey]) {
                    rowRemark = "Duplicate major contributor found for the same masterId";
                } else {
                    majorContributorMasterIdMap[majorContributorKey] = true;
                }
            }

            if (columnName === "masterId" && !validateUUID(cellValue)) {
                rowRemark = "Invalid UUID for masterId";
            }

            if (columnName === "id" && cellValue && !validateUUID(cellValue)) {
                rowRemark = "Invalid UUID for id";
            }
        });
        if (!allCellsEmpty) {
            if (rowRemark) {
                errorArr.push({ ...rowObject, remarks: rowRemark });
            } else if (rowObject.id) {
                updateArr.push(rowObject);
            } else {
                insertArr.push(rowObject);
            }
        }
    }

    if (!insertArr?.length && !updateArr?.length && !errorArr?.length) throwError(statusCodes.BAD_REQUEST, "No Empty File Allowed.");
    return { insertArr, updateArr, errorArr, columnNames, sheetName };
};

const processExcelErrors = async (errorArr, columnNames, sheetName) => {
    const errorColumns = [...columnNames, "remarks"];
    const errorWorkbook = new Excel.Workbook();
    const errorWorksheet = errorWorkbook.addWorksheet(sheetName);
    const headerStyle = errorWorkbook.createStyle({ font: { color: "#00a9ff", bold: true } });
    const createRedFontStyle = () => errorWorkbook.createStyle({ font: { color: "#ff0000" } });
    errorColumns.forEach((name, colNumber) => { errorWorksheet.cell(1, colNumber + 1).string(name).style(headerStyle); });

    // Add your data to the worksheet
    errorArr.forEach((row, rowNum) => {
        errorColumns.forEach((name, colNumber) => {
            const cell = errorWorksheet.cell(rowNum + 2, colNumber + 1);
            if (name === "remarks") {
                cell.string(row[name]).style(createRedFontStyle());
            } else if (typeof row[name] === "number") {
                cell.number(row[name]);
            } else if (!row[name]) {
                cell.string("");
            } else {
                cell.string(row[name]);
            }
        });
    });

    if (!errorArr?.length) return;
    const bufferData = await errorWorkbook.writeToBuffer();
    return {
        buffer: bufferData,
        contentType: "application/vnd.openxmlformats",
        filename: `${sheetName}Error.xlsx`
    };
};

const qaMasterMakerLovImport = async (req) => {
    const { user: { userId } } = req;
    const createdBy = userId;
    const updatedBy = userId;
    const uploadedFile = req.files.excelFile;
    const { insertArr, updateArr, errorArr, columnNames, sheetName } = await processExcelFile(uploadedFile);

    const newInsertArr = [];
    if (insertArr?.length) {
        for await (const obj of insertArr) {
            const { masterId, majorContributor, code, priority, defect, observationTypeId, observationSeverityId } = obj;
            const isMasterExists = await qaMasterMakerAlreadyExists({ id: masterId });
            if (!isMasterExists) {
                obj.remarks = "masterId not exists";
            } else {
                const isObservationTypeExists = await masterMakerLovsAlreadyExists({ id: observationTypeId });
                if (!isObservationTypeExists) {
                    obj.remarks = "observationTypeId not exists";
                } else {
                    const isObservationSeverityExists = await masterMakerLovsAlreadyExists({ id: observationSeverityId });
                    if (!isObservationSeverityExists) {
                        obj.remarks = "observationSeverityId not exists";
                    } else {
                        const isMajorContributorExists = await qaMasterMakerLovsService.qaMasterMakerLovAlreadyExists({ masterId, majorContributor: { [Op.iLike]: majorContributor } });
                        if (isMajorContributorExists) {
                            obj.remarks = "majorContributor already exists";
                        } else {
                            const isCodeExists = await qaMasterMakerLovsService.qaMasterMakerLovAlreadyExists({ masterId, code: { [Op.iLike]: code } });
                            if (isCodeExists) obj.remarks = "code already exists";
                        }
                    }
                }
            }
            if (obj.remarks) {
                errorArr.push(obj);
            } else {
                const inserteObj = { masterId, majorContributor, code, priority, defect, observationTypeId, observationSeverityId, createdBy, updatedBy };
                newInsertArr.push(inserteObj);
            }
        }
    }
    if (newInsertArr?.length) await qaMasterMakerLovsService.bulkCreateQaMasterMakerLov(newInsertArr);

    if (updateArr?.length) {
        for await (const obj of updateArr) {
            const { id, masterId, majorContributor, code, priority, defect, observationTypeId, observationSeverityId } = obj;
            const isQaMasterMakerLovExists = await qaMasterMakerLovsService.qaMasterMakerLovAlreadyExists({ id });
            if (!isQaMasterMakerLovExists) {
                obj.remarks = "id not exists";
            } else {
                const isMasterExists = await qaMasterMakerAlreadyExists({ id: masterId });
                if (!isMasterExists) {
                    obj.remarks = "masterId not exists";
                } else {
                    const isObservationTypeExists = await masterMakerLovsAlreadyExists({ id: observationTypeId });
                    if (!isObservationTypeExists) {
                        obj.remarks = "observationTypeId not exists";
                    } else {
                        const isObservationSeverityExists = await masterMakerLovsAlreadyExists({ id: observationSeverityId });
                        if (!isObservationSeverityExists) {
                            obj.remarks = "observationSeverityId not exists";
                        } else {
                            const isMajorContributorExists = await qaMasterMakerLovsService.qaMasterMakerLovAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: id } }, { masterId, majorContributor: { [Op.iLike]: majorContributor } }] });
                            if (isMajorContributorExists) {
                                obj.remarks = "majorContributor already exists";
                            } else {
                                const isCodeExists = await qaMasterMakerLovsService.qaMasterMakerLovAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: id } }, { masterId, code: { [Op.iLike]: code } }] });
                                if (isCodeExists) obj.remarks = "code already exists";
                            }
                        }
                    }
                }
            }
            if (obj.remarks) {
                errorArr.push(obj);
            } else {
                const updateObj = { masterId, majorContributor, code, priority, defect, observationTypeId, observationSeverityId, updatedBy };
                await qaMasterMakerLovsService.updateQaMasterMakerLov(updateObj, { id });
            }
        }
    }

    return processExcelErrors(errorArr, columnNames, sheetName);
};

module.exports = {
    createQaMasterMakerLov,
    getQaMasterMakerLovList,
    updateQaMasterMakerLov,
    deleteQaMasterMakerLov,
    getQaMasterMakerLovHistory,
    qaMasterMakerLovSchemaExport,
    qaMasterMakerLovImport
};

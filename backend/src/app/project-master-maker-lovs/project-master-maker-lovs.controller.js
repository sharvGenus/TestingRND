const sequelize = require("sequelize");
const XLSX = require("xlsx");
const { Op } = require("sequelize");
const Excel = require('excel4node');
const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const projectMasterMakerLovsService = require("./project-master-maker-lovs.service");
const { getMappingKeysInArray } = require("../../utilities/common-utils");
const ProjectMasterMakerLovs = require("../../database/operation/project-master-maker-lovs");

const mapping = {
    "project_master_maker_lovs.name": "name",
    "project_master_maker_lovs.code": "code",
    "updated.name": "updated.name",
    "created.name": "created.name"
};

const filterMapping = {
    name: "name",
    code: "code",
    updatedBy: "$updated.name$",
    createdBy: "$created.name$"
};

/**
 * Method to create project master maker LOV
 * @param { object } req.body
 * @returns { object } data
 */
const createProjectMasterMakerLovs = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.PROJECT_MISSING_MASTER_MAKER_LOV_DETAILS);
    // Check if the name already exists for the given masterId
    const isNameExists = await projectMasterMakerLovsService.projectMasterMakerLovsAlreadyExists({ name: req.body.name, masterId: req.body.masterId });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.PROJECT_MASTER_MAKER_LOV_ALREADY_EXIST);
    // Check if the code already exists for the given masterId
    const isCodeExists = await projectMasterMakerLovsService.projectMasterMakerLovsAlreadyExists({ code: req.body.code, masterId: req.body.masterId });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.PROJECT_MASTER_MAKER_LOV_ALREADY_EXIST);
    const data = await projectMasterMakerLovsService.createProjectMasterMakerLovs(req.body);
    return { data };
};

/**
 * Method to update project master maker LOV
 * @param { object } req.body
 * @returns { object } data
 */
const updateProjectMasterMakerLovs = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.PROJECT_MASTER_MAKER_LOV_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.PROJECT_MISSING_MASTER_MAKER_LOV_DETAILS);
    const isMasterMakerLovsExists = await projectMasterMakerLovsService
        .projectMasterMakerLovsAlreadyExists({ id: req.params.id });
    throwIfNot(isMasterMakerLovsExists, statusCodes.DUPLICATE, statusMessages.PROJECT_MASTER_MAKER_LOV_NOT_EXIST);
    // Check if the name already exists for the given masterId
    const isNameExists = await
    projectMasterMakerLovsService.projectMasterMakerLovsAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { name: req.body.name, masterId: req.body.masterId }] });
    throwIf(isNameExists, statusCodes.DUPLICATE, statusMessages.MASTER_PROJECT_MAKER_ALREADY_EXIST);
    // Check if the code already exists for the given masterId
    const isCodeExists = await
    projectMasterMakerLovsService.projectMasterMakerLovsAlreadyExists({ [Op.and]: [{ id: { [Op.ne]: req.params.id } }, { code: req.body.code, masterId: req.body.masterId }] });
    throwIf(isCodeExists, statusCodes.DUPLICATE, statusMessages.MASTER_PROJECT_MAKER_ALREADY_EXIST);
    const data = await projectMasterMakerLovsService.updateProjectMasterMakerLovs(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get project master maker LOV details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getProjectMasterMakerLovsDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.PROJECT_MASTER_MAKER_LOV_ID_REQUIRED);
    const data = await projectMasterMakerLovsService.getProjectMasterMakerLovByCondition({ id: req.params.id });
    return { data };
};

const getProjectMasterMakerLovsHistory = async (req) => {
    throwIfNot(req.params.recordId, statusCodes.BAD_REQUEST, statusMessages.PROJECT_MASTER_MAKER_LOV_ID_REQUIRED);
    const data = await projectMasterMakerLovsService.getProjectMasterMakerLovHistory({ recordId: req.params.recordId });
    return { data };
};

/**
 * Method to get all project master maker LOV
 * @param { object } req.body
 * @returns { object } data
 */
const getAllProjectMasterMakerLovs = async (req) => {
    const data = await projectMasterMakerLovsService.getAllProjectMasterMakerLovs();
    return { data };
};

/**
 * Method to delete project master maker LOV by master maker LOV id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteProjectMasterMakerLovs = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.PROJECT_MASTER_MAKER_LOV_ID_REQUIRED);
    const data = await projectMasterMakerLovsService.deleteProjectMasterMakerLov({ id: req.params.id });
    return { data };
};

/**
 * Method to get all  project master maker lov based on master
 * @param { object } req.body
 * @returns { object } data
 */
const getAllProjectMasterMakerLovsByMasterId = async (req) => {
    const { searchString, accessors, filterObject } = req.query;
    const filterString = filterObject ? JSON.parse(filterObject) : {};
    const condition = {
        [Op.and]: []
    };

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
        condition[Op.and].push(orConditions);
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
                condition[Op.and].push(mappedCondition);
            }
        }
    }

    if (req.params.id && req.params.id !== 'all') {
        condition[Op.and].push({ masterId: req.params.id });
    }
    const data = await projectMasterMakerLovsService
        .getAllProjectMasterMakerLovsByMasterId(condition);
    return { data };
};

const projectMasterMakerLovSchema = [
    {
        columnName: 'master_id',
        name: 'Master ID',
        columnType: 'uuid',
        type: 'uuid-mandatory'
    },
    {
        columnName: 'master_name',
        name: 'Master Name',
        columnType: 'text',
        type: 'text'
    },
    {
        columnName: 'id',
        name: 'ID',
        columnType: 'uuid',
        type: 'uuid'
    },
    {
        columnName: 'name',
        name: 'LOV Name',
        columnType: 'text',
        type: 'text-mandatory'
    },
    {
        columnName: 'code',
        name: 'LOV Code',
        columnType: 'text',
        type: 'text-mandatory'
    },
    {
        columnName: 'description',
        name: 'Description',
        columnType: 'text',
        type: 'text'
    }
];

const exportProjectMasterMakeLovSchema = async (req, res) => {
    const {projectMasterMakerLov: {masterId}} = req.body;
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Project-master-lov");
    const existingRecordWorksheet = workbook.addWorksheet("Existing-records");

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

    const columnNames = projectMasterMakerLovSchema.map(({columnName}) => columnName);
    const dataTypes = projectMasterMakerLovSchema.map(({type}) => type);

    columnNames.forEach((name, index) => {
        worksheet.cell(1, index + 1).string(name).style(headerStyle);
        existingRecordWorksheet.cell(1, index + 1).string(name).style(headerStyle);
    })

    dataTypes.forEach((type, index) => {
        worksheet.cell(2, index + 1).string(type).style(boldStyle);
    });

    const projectMasterMakerLovs = new ProjectMasterMakerLovs();
    const existingRecordCondition = {};
    if (masterId) {
        existingRecordCondition.masterId = masterId;
    }
    const existingLOVData = await projectMasterMakerLovs.findAll(existingRecordCondition, undefined, true);
    existingLOVData.forEach((data, row) => {
        console.log(data);
        columnNames.forEach((name, col) => {
            let value;
            if (name === 'master_name') {
                value = data?.project_master_maker?.name;
            } else if (name === 'master_id') {
                value = data?.project_master_maker?.id;
            }  else {
                value = data[name];
            }
            existingRecordWorksheet.cell(row + 2, col + 1).string(value);
        });
    })

    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader("Content-Disposition", `attachment; filename=project-master-maker-lov.xlsx`);

    workbook.writeToBuffer().then((buffer) => {
        res.end(buffer);
    });
}

function isValidUUID(uuid) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
}

const processExcelFile = (uploadedFile) => {
    const workbook = XLSX.read(uploadedFile.data, {type: 'buffer'});
    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    const columnNames = [];
    const requiredColumns = ['master_id', 'name', 'code'];

    for(let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = { c: C, r: 0 };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        const columnName = worksheet[cellRef] ? worksheet[cellRef].v : null;
        // Check for empty cells in the header
        if (columnName !== null && columnName !== undefined) {
            columnNames.push(columnName);
        }
    }

    const requiredColumnCheck = requiredColumns.some((name) => !columnNames.includes(name));
    throwIf(requiredColumnCheck, statusCodes.NOT_FOUND, "Invalid Data.");

    const errorData = [];
    const insertData = [];
    const updateData = [];
    const nameObj = {};
    const codeObj = {};
    for(let R = 2; R <= range.e.r; ++R) {
        let rowRemark;
        const data = {};
        columnNames.forEach((columnName, C) => {
            const cellAddress = { c:C, r: R };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            data[columnName] = worksheet[cellRef]?.v;
            if (((data.id && columnName !== 'id' && columnName !== 'description') || requiredColumns.includes(columnName)) && worksheet[cellRef] === undefined) {
                rowRemark = "Cannot have blank cell";
            }
        });

        if (nameObj[data.name]) {
            rowRemark = "Duplicate name found";
        } else {
            nameObj[data.name] = data.code;
        }

        if (codeObj[data.code]) {
            rowRemark = "Duplicate code found";
        } else {
            codeObj[data.code] = data.name;
        }

        if (data.id && !isValidUUID(data.id)) {
            rowRemark = "Invalid UUID found";
        }

        if (rowRemark) {
            errorData.push({...data, remarks: rowRemark});
        } else {
            if (data.id) updateData.push(data);
            else insertData.push(data);
        }
    }

    return {insertData, updateData, errorData, sheetName, columnNames};
}

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
            } else if (!row[name]) {
                cell.string("");
            } else {
                cell.string(`${row[name]}`);
            }
        });
    });

    if (!errorArr.length) return;

    const bufferData = await errorWorkbook.writeToBuffer();
    return {
        buffer: bufferData,
        contentType: "application/vnd.openxmlformats",
        filename: `${sheetName}Error.xlsx`
    };
};

const importSchemaFile = async (req, res) => {
    const uploadedFile = req.files.excelFile;
    const {insertData, updateData, errorData, columnNames, sheetName} = processExcelFile(uploadedFile);

    const existingRecordCondition = {[Op.or]: []};
    existingRecordCondition[Op.or].push({name: {[Op.in]: [...insertData.map(({name}) => name), ...updateData.map(({name}) => name)]}});
    existingRecordCondition[Op.or].push({code: {[Op.in]: [...insertData.map(({code}) => `${code}`), ...updateData.map(({code}) => `${code}`)]}});
    existingRecordCondition[Op.or].push({id: {[Op.in]: [...updateData.map(({id}) => id)]}});

    const projectMasterMakerLovs = new ProjectMasterMakerLovs({listType: '2'});
    const existingRecord = await projectMasterMakerLovs.findAll(existingRecordCondition, ["code", "name", "masterId", "id"]);
    const existingNameObj = {};
    const existingIdObj = {};
    const existingCodeObj = {};
    existingRecord.forEach(({id, masterId, name, code})=>{
        existingCodeObj[code] = `${id} ${masterId}`;
        existingNameObj[name] = `${id} ${masterId}`;
        existingIdObj[id] = masterId;
    })

    const filteredInsertData = insertData.filter(({master_id, master_name, name, code}) => {
        if ((existingCodeObj[code] && existingCodeObj[code].split(" ")[1] === master_id) || (existingNameObj[name] && existingNameObj[name].split(" ")[1] === master_id)) {
            errorData.push({id: undefined, name, code, master_id, master_name, remarks: `LOV ${existingCodeObj[code] ? 'code' : existingNameObj[name] ? 'name' : ''} already present`});
            return false;
        }
        return true;
    })

    const filteredUpdateData = updateData.filter(({master_id, master_name, id, name, code}) => {
        if ((existingCodeObj[code] && existingCodeObj[code].split(" ")[0] !== id && existingCodeObj[code].split(" ")[1] === master_id) || (existingNameObj[name] && existingNameObj[name].split(" ")[0] !== id && existingNameObj[name].split(" ")[1] === master_id)) {
            errorData.push({id, name, code, master_id, master_name, remarks: `LOV ${existingCodeObj[code] ? 'code' : existingNameObj[name] ? 'name' : ''} already present`});
            return false;
        } else if (existingIdObj[id] !== master_id) {
            errorData.push({id, name, code, master_id, master_name, remarks: `LOV belongs to different Master Maker`});
            return false;
        }
        return true;
    });

    console.log(filteredInsertData, filteredUpdateData);

    await Promise.all([
        projectMasterMakerLovsService.bulkInsertLOVs(filteredInsertData.map(data => ({...data, masterId: data.master_id, createdBy: req.user.userId, updatedBy: req.user.userId}))),
        ...filteredUpdateData.map(({name, description, code, id, master_id}) => projectMasterMakerLovsService.updateProjectMasterMakerLovs({name, description, code}, {id, masterId: master_id}))
    ]);

    return processExcelErrors(errorData, columnNames, sheetName);
}

module.exports = {
    createProjectMasterMakerLovs,
    updateProjectMasterMakerLovs,
    getProjectMasterMakerLovsDetails,
    getProjectMasterMakerLovsHistory,
    getAllProjectMasterMakerLovs,
    deleteProjectMasterMakerLovs,
    getAllProjectMasterMakerLovsByMasterId,
    exportProjectMasterMakeLovSchema,
    importSchemaFile
};

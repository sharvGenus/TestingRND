const { Op } = require("sequelize");
const Excel = require("excel4node");
const XLSX = require("xlsx");

const statusCodes = require("../../config/status-codes");
const { throwIfNot } = require("../../services/throw-error-class");
const StockLedgerDetails = require("../../database/operation/stock-ledger-details");
const { getOrganizationStoreByCondition, organizationStoreAlreadyExists } = require("../organization-stores/organization-stores.service");
const { getOrgStoreLocationByCondition, organizationStoreLocationAlreadyExists } = require("../organization-store-locations/organization-store-locations.service");
const { getAllStoreLocationTransactionData, getActiveSerialNumbersInStore, createCtiTransaction, createItiTransaction } = require("../stock-ledgers/stock-ledgers.controller");
const { projectAlreadyExists } = require("../projects/projects.service");
const { materialAlreadyExists, getMaterialByCondition } = require("../materials/materials.service");
const { userAlreadyExists } = require("../users/users.service");
const { checkForInstallation } = require("../stock-ledgers/stock-ledgers.service");
const { isTransactionTypeRangeExists } = require("../transaction-type-ranges/transaction-type-ranges.service");

const transactionsType = {
    cti: "5b4e46d5-7bf5-4f42-8c4a-b6337533fdff",
    itc: "799ee00c-0819-498a-9e47-3ac269f33db8"
};

const transactionsSchema = {
    cti: [
        {
            column_name: "projectId",
            name: "projects",
            column_type: "uuid",
            type: "uuid (projects)-mandatory"
        },
        {
            column_name: "storeId",
            name: "organization_stores",
            column_type: "uuid",
            type: "uuid (organization_stores)-mandatory"
        },
        {
            column_name: "installerId",
            name: "users",
            column_type: "uuid",
            type: "uuid (users)-mandatory"
        },
        {
            column_name: "fromStoreLocationId",
            name: "organization_store_locations",
            column_type: "uuid",
            type: "uuid (organization_store_locations)-mandatory"
        },
        {
            column_name: "materialId",
            name: "materials",
            column_type: "uuid",
            type: "uuid (materials)-mandatory"
        },
        {
            column_name: "serialNo",
            name: null,
            column_type: "character varying",
            type: "text-'null' if quantity is not 'null'"
        },
        {
            column_name: "quantity",
            name: null,
            column_type: "double precision",
            type: "number-'null' if serialNo is not 'null'"
        }
    ],
    itc: [
        {
            column_name: "projectId",
            name: "projects",
            column_type: "uuid",
            type: "uuid (projects)-mandatory"
        },
        {
            column_name: "storeId",
            name: "organization_stores",
            column_type: "uuid",
            type: "uuid (organization_stores)-mandatory"
        },
        {
            column_name: "installerId",
            name: "users",
            column_type: "uuid",
            type: "uuid (users)-mandatory"
        },
        {
            column_name: "materialId",
            name: "materials",
            column_type: "uuid",
            type: "uuid (materials)-mandatory"
        },
        {
            column_name: "serialNo",
            name: null,
            column_type: "character varying",
            type: "text-'null' if quantity is not 'null'"
        },
        {
            column_name: "quantity",
            name: null,
            column_type: "double precision",
            type: "number-'null' if serialNo is not 'null'"
        }
    ],
    iti: [
        {
            column_name: "projectId",
            name: "projects",
            column_type: "uuid",
            type: "uuid (projects)-mandatory"
        },
        {
            column_name: "storeId",
            name: "organization_stores",
            column_type: "uuid",
            type: "uuid (organization_stores)-mandatory"
        },
        {
            column_name: "fromInstallerId",
            name: "users",
            column_type: "uuid",
            type: "uuid (users)-mandatory"
        },
        {
            column_name: "toInstallerId",
            name: "users",
            column_type: "uuid",
            type: "uuid (users)-mandatory"
        },
        {
            column_name: "materialId",
            name: "materials",
            column_type: "uuid",
            type: "uuid (materials)-mandatory"
        },
        {
            column_name: "serialNo",
            name: null,
            column_type: "character varying",
            type: "text-'null' if quantity is not 'null'"
        },
        {
            column_name: "quantity",
            name: null,
            column_type: "double precision",
            type: "number-'null' if serialNo is not 'null'"
        }
    ]
};

const exportTransactionsSchemaFile = async (req, res) => {
    const { transactionName } = req.body;
    const transactionSchema = transactionsSchema[transactionName];
    
    const { db } = new StockLedgerDetails();
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(transactionName);
    
    const columnNames = transactionSchema.map((row) => row.column_name);
    const dataTypes = transactionSchema.map((row) => row.type);
    const distinctNonNullNames = [...new Set(transactionSchema.filter((item) => item.name !== null).map((item) => item.name))];

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
        const table = tableName.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");

        if (tableName !== "serial_numbers" && tableName !== "nonserialize_materials") {
            const tableSheet = workbook.addWorksheet(table);
            
            // Query the data for the current table name
            const tableDataSql = `SELECT * FROM ${tableName} WHERE is_active = '1' ${tableName === "organization_stores" || tableName === "users" ? "AND (organization_type = '420e7b13-25fd-4d23-9959-af1c07c7e94b' OR organization_type = 'decb6c57-6d85-4f83-9cc2-50e0630003df')" : ""} ${tableName === "materials" ? "AND id != '84b473e1-62bb-4afe-af56-1691bdffbc55'" : ""} ${tableName === "organization_store_locations" ? "AND (organization_type = '420e7b13-25fd-4d23-9959-af1c07c7e94b' OR organization_type = 'decb6c57-6d85-4f83-9cc2-50e0630003df') AND (name ILIKE '%receiving%' OR name ILIKE '%brought out%' OR name ILIKE '%genus supply%')" : ""} ${tableName === "organization_store_locations" ? "ORDER BY CASE WHEN name ILIKE '%receiving%' THEN 1 WHEN name ILIKE '%brought out%' THEN 2 WHEN name ILIKE '%genus supply%' THEN 3 ELSE 4 END" : ""}`;
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
        }
    });

    await Promise.all(queryPromises);

    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader("Content-Disposition", `attachment; filename=${transactionName}.xlsx`);

    workbook.writeToBuffer().then((buffer) => {
        res.end(buffer);
    });
};

const processExcelErrors = async (errorArr, columnNames, sheetName, checkArr) => {
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
        for (const val of checkArr) {
            if (sheetName === "cti") {
                if (row.remarks === "Success" && row.projectId === val.projectId && row.storeId === val.storeId && row.installerId === val.installerId && row.fromStoreLocationId === val.fromStoreLocationId && row.materialId === val.materialId) {
                    if ((val.quantity === "null" && val.serialNo.includes(row.serialNo)) || val.serialNo === "null" || (val.quantity === "null" && !val.serialNo?.length && val.remarks !== "Success")) row.remarks = val.remarks;
                }
            } else if (sheetName === "itc") {
                if (row.remarks === "Success" && row.projectId === val.projectId && row.storeId === val.storeId && row.installerId === val.installerId && row.materialId === val.materialId) {
                    if ((val.quantity === "null" && val.serialNo.includes(row.serialNo)) || val.serialNo === "null") row.remarks = val.remarks;
                }
            } else if (sheetName === "iti") {
                if (row.remarks === "Success" && row.projectId === val.projectId && row.storeId === val.storeId && row.fromInstallerId === val.fromInstallerId && row.toInstallerId === val.toInstallerId && row.materialId === val.materialId) {
                    if ((val.quantity === "null" && val.serialNo.includes(row.serialNo)) || val.serialNo === "null") row.remarks = val.remarks;
                }
            }
        }
        errorColumns.forEach((name, colNumber) => {
            const cell = errorWorksheet.cell(rowNum + 2, colNumber + 1);
            if ((name === "quantity" && typeof row[name] === "number") || (name === "serialNo" && typeof row[name] === "number")) {
                cell.number(row[name]);
            } else {
                cell.string(row[name]);
            }
            if (name === "remarks") {
                if (row[name] === "Success") {
                    cell.style(createGreenFontStyle());
                } else {
                    cell.style(createRedFontStyle());
                }
            }
        });
    });

    let bufferData;
    const isErrorExists = errorArr?.length && errorArr.filter((obj) => obj.remarks !== "Success");
    if (isErrorExists?.length) {
        // errorWorkbook.write(`${sheetName}Error.xlsx`);

        // res.setHeader("Content-Type", "application/vnd.openxmlformats");
        // res.setHeader("Content-Disposition", `attachment; filename=${sheetName}Error.xlsx`);

        // await errorWorkbook.writeToBuffer().then((buffer) => {
        //     res.end(buffer);
        // });

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

    const errorArr = [];
    const resultArray = [];
    // Extract data rows
    for (let R = 2; R <= range.e.r; ++R) {
        const rowObject = {};
        let skipRow = false;
        let rowRemark = "";
        let allCellsEmpty = true;
        let quantityIsNull = false;
        let serialNoIsNull = false;
        let serialNoNotNull = false;
        let quantityNotNull = false;
        columnNames.forEach((columnName, C) => {
            const cellAddress = { c: C, r: R };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            // Check for empty cells
            if (worksheet[cellRef] === undefined) {
                skipRow = true;
                rowRemark = `${columnName} is empty`;
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
            // rowObject[columnName] = cellValue;
            rowObject[columnName] = columnName === "serialNo" ? cellValue?.toString() : cellValue;

            if (columnName === "serialNo" && cellValue !== "null") serialNoNotNull = true;
            if (serialNoNotNull === true && columnName === "quantity" && cellValue !== "null") {
                skipRow = true;
                if (rowRemark === "") rowRemark = "Either serialNo or quantity should be null";
            }

            if (columnName === "quantity" && cellValue !== "null") quantityNotNull = true;
            if (quantityNotNull === true && columnName === "serialNo" && cellValue !== "null") {
                skipRow = true;
                if (rowRemark === "") rowRemark = "Either serialNo or quantity should be null";
            }

            if (columnName === "quantity" && cellValue === "null") quantityIsNull = true;
            if (columnName === "serialNo" && cellValue === "null") serialNoIsNull = true;

            if (columnName === "quantity" && cellValue !== "null" && typeof cellValue !== "number") {
                skipRow = true;
                if (rowRemark === "") rowRemark = "Quantity is not a number";
            }

            if (columnName === "quantity" && cellValue !== "null" && typeof cellValue === "number" && cellValue <= 0) {
                skipRow = true;
                if (rowRemark === "") rowRemark = "Quantity should be greater than 0";
            }
        });
        // Check if both "serialNo" and "quantity" are "null"
        if (quantityIsNull && serialNoIsNull) {
            skipRow = true;
            rowRemark = "Both serialNo and quantity are null";
        }
        // Skip row if all cells are empty
        if (!allCellsEmpty) {
            errorArr.push({ ...rowObject, remarks: rowRemark || "Success" });
        }
        // Check if the row should be skipped
        if (!skipRow) {
            resultArray.push(rowObject);
        }
    }

    return { resultArray, sheetName, columnNames, errorArr };
};

const checkErrorArray = async (errorArr) => {
    for await (const val of errorArr) {
        if (val.remarks === "Success") {
            const materialDetails = await getMaterialByCondition({ id: val.materialId });
            if (!materialDetails) {
                val.remarks = "Material Not Found.";
            } else if (materialDetails.isSerialNumber === true && val.serialNo === "null") {
                val.remarks = "Serial number should be valid & quantity should be null.";
            } else if (materialDetails.isSerialNumber === false && val.quantity === "null") {
                val.remarks = "Serial number should be null & quantity should be valid.";
            }
        }
    }
    return errorArr;
};

const checkResultArray = async (resultArray) => {
    for await (const val of resultArray) {
        const materialDetails = await getMaterialByCondition({ id: val.materialId });
        if (!materialDetails) {
            val.skipRow = true;
        } else if (materialDetails.isSerialNumber === true && val.serialNo === "null") {
            val.skipRow = true;
        } else if (materialDetails.isSerialNumber === false && val.quantity === "null") {
            val.skipRow = true;
        }
    }
    const filteredResultArray = (resultArray.length && resultArray.filter((obj) => !obj.skipRow)) || [];
    throwIfNot(filteredResultArray?.length, statusCodes.NOT_FOUND, "No Data Found.");
    return filteredResultArray;
};

const importCtiTransactions = async (req) => {
    const { user: { userId } } = req;
    const uploadedFile = req.files.excelFile;
    const { resultArray, sheetName, columnNames, errorArr } = await processExcelFile(uploadedFile);
    const sheetNameLower = sheetName.toLowerCase();
    throwIfNot(sheetNameLower === "cti", statusCodes.NOT_FOUND, "Transaction Sheet Not Found.");
    const transactionTypeId = transactionsType[sheetNameLower];
    throwIfNot(resultArray?.length, statusCodes.NOT_FOUND, "No Data Found.");

    const requiredKeys = ["projectId", "storeId", "installerId", "fromStoreLocationId", "materialId", "serialNo", "quantity"];
    const hasRequiredKeys = (obj) => requiredKeys.every((key) => Object.keys(obj).includes(key));
    const allObjectsHaveKeys = resultArray.every(hasRequiredKeys);
    throwIfNot(allObjectsHaveKeys, statusCodes.NOT_FOUND, "Invalid Data.");

    const newErrorArr = await checkErrorArray(errorArr);
    const filteredResultArray = await checkResultArray(resultArray);

    const groupedData = {};
    const handleNewItem = (key, item) => {
        const newItem = {
            transactionTypeId,
            projectId: item.projectId,
            storeId: item.storeId,
            installerId: item.installerId,
            fromStoreLocationId: item.fromStoreLocationId,
            materialId: item.materialId,
            quantity: item.quantity === "null" ? 1 : parseFloat(item.quantity.toFixed(3)),
            serialNumber: item.quantity === "null" && item.serialNo !== undefined && item.serialNo !== null ? [item.serialNo] : [],
            createdBy: userId,
            updatedBy: userId
        };
        groupedData[key].stock_ledgers.push(newItem);
    };

    filteredResultArray.forEach((item) => {
        const key = `${item.projectId}-${item.storeId}-${item.installerId}`;
        if (!groupedData[key]) {
            groupedData[key] = {
                transactionTypeId,
                createdBy: userId,
                updatedBy: userId,
                stock_ledgers: []
            };
        }
        const existingItemSerialize = groupedData[key].stock_ledgers.find(
            (m) => m.fromStoreLocationId === item.fromStoreLocationId && m.materialId === item.materialId && item.quantity === "null" && item.serialNo !== "null"
        );
        const existingItemNonSerialize = groupedData[key].stock_ledgers.find(
            (m) => m.fromStoreLocationId === item.fromStoreLocationId && m.materialId === item.materialId && item.serialNo === "null" && Number(item.quantity) > 0
        );
        if (item.quantity === "null" && item.serialNo !== "null") {
            if (existingItemSerialize) {
                if (!existingItemSerialize.serialNumber.includes(item.serialNo)) existingItemSerialize.serialNumber.push(item.serialNo);
                existingItemSerialize.quantity = existingItemSerialize.serialNumber.length;
            } else {
                handleNewItem(key, item);
            }
        } else if (item.serialNo === "null" && Number(item.quantity) > 0) {
            if (existingItemNonSerialize) {
                existingItemNonSerialize.quantity += Number(item.quantity);
                existingItemNonSerialize.quantity = parseFloat(existingItemNonSerialize.quantity.toFixed(3));
            } else {
                handleNewItem(key, item);
            }
        }
    });

    const groupedDataArr = Object.values(groupedData);
    throwIfNot(groupedDataArr?.length, statusCodes.NOT_FOUND, "No Data Found.");

    const checkArr = [];
    for await (const data of groupedDataArr) {
        if (data.stock_ledgers.length > 0) {
            for await (const sl of data.stock_ledgers) {
                const checkObj = {
                    projectId: sl.projectId,
                    storeId: sl.storeId,
                    installerId: sl.installerId,
                    fromStoreLocationId: sl.fromStoreLocationId,
                    materialId: sl.materialId,
                    quantity: sl.serialNumber.length > 0 ? "null" : sl.quantity,
                    serialNo: sl.serialNumber.length > 0 ? sl.serialNumber : "null",
                    remarks: ""
                };
                try {
                    const isProjectExists = await projectAlreadyExists({ id: sl.projectId });
                    if (!isProjectExists) checkObj.remarks = "Project Not Found.";
                    const isStoreExists = await organizationStoreAlreadyExists({ id: sl.storeId });
                    if (!isStoreExists) checkObj.remarks = "Store Not Found.";
                    const isStoreLocationExists = await organizationStoreLocationAlreadyExists({ id: sl.fromStoreLocationId, organizationStoreId: sl.storeId });
                    if (!isStoreLocationExists) checkObj.remarks = "Store Location Not Found.";
                    const isMaterialExists = await materialAlreadyExists({ id: sl.materialId });
                    if (!isMaterialExists) checkObj.remarks = "Material Not Found.";

                    const storeDetails = await getOrganizationStoreByCondition({ id: sl.storeId });
                    if (!storeDetails) checkObj.remarks = "Store Not Found.";
                    const { organization, organizationType } = storeDetails;
                    sl.organizationId = organization.parentId === null ? organization.id : organization.parent.id;

                    const isInstallerExists = await userAlreadyExists({ id: sl.installerId, oraganizationId: sl.organizationId });
                    if (!isInstallerExists) checkObj.remarks = "Installer Not Found.";

                    if (isProjectExists && isStoreExists && isInstallerExists && isStoreLocationExists && isMaterialExists) {
                        const installerStoreLocation = await getOrgStoreLocationByCondition({
                            name: { [Op.iLike]: "%installer%" },
                            organizationStoreId: sl.storeId,
                            isActive: "1"
                        }, { order: [["createdAt", "DESC"]] });
                        if (!installerStoreLocation) checkObj.remarks = "Installer Store Location Not Found.";
                        sl.storeLocationId = installerStoreLocation.id;
    
                        const storeLocationData = await getAllStoreLocationTransactionData({
                            query: {
                                projectId: sl.projectId,
                                storeId: sl.storeId,
                                storeLocationId: sl.fromStoreLocationId,
                                materialId: sl.materialId
                            }
                        });
                        if (!storeLocationData) checkObj.remarks = "Stock Not Found.";
    
                        const { allStoreLocationTransactionData: [{ material, uom, rate, tax, quantity }] } = storeLocationData;
                        sl.uomId = uom.id;
                        sl.rate = rate;
                        sl.tax = tax;
                        sl.value = sl.quantity * sl.rate;
    
                        if (material.isSerialNumber === true && sl.serialNumber.length === 0) {
                            sl.removeObj = true;
                        } else if (material.isSerialNumber === false && sl.serialNumber.length > 0) {
                            sl.removeObj = true;
                        }
    
                        if (material.isSerialNumber === true && sl.serialNumber.length > 0) {
                            const getActiveSerialNumbers = await getActiveSerialNumbersInStore({
                                query: {
                                    projectId: sl.projectId,
                                    storeId: sl.storeId,
                                    storeLocationId: sl.fromStoreLocationId,
                                    materialId: sl.materialId
                                }
                            });
                            if (getActiveSerialNumbers.count > 0) {
                                const tempSerialNumber = sl.serialNumber;
                                sl.serialNumber = sl.serialNumber.filter((serialNumber) => getActiveSerialNumbers.serialNumbersByMaterial[sl.materialId].includes(serialNumber));
                                sl.quantity = sl.serialNumber.length;
                                sl.value = sl.quantity * sl.rate;
                                checkObj.serialNo = tempSerialNumber.filter((serialNumber) => !getActiveSerialNumbers.serialNumbersByMaterial[sl.materialId].includes(serialNumber));
                                if (checkObj.serialNo.length > 0) checkObj.remarks = "Serial Number Not Found.";
                            } else {
                                checkObj.remarks = "Serial Number Not Found.";
                                sl.serialNumber = [];
                            }
                            if (sl.serialNumber.length === 0) sl.removeObj = true;
                        } else if (material.isSerialNumber === false && quantity < sl.quantity) {
                            checkObj.remarks = "Total Requested Quantity Not Available.";
                            sl.removeObj = true;
                        }

                        const isInstallationCheckPass = await checkForInstallation({
                            projectId: sl.projectId,
                            installerOrgId: sl.organizationId,
                            installerStoreId: sl.storeId,
                            materialId: sl.materialId,
                            serialNumber: material.isSerialNumber === true ? sl.serialNumber : [],
                            isCompany: organizationType === "420e7b13-25fd-4d23-9959-af1c07c7e94b",
                            byImport: true
                        });
                        if (isInstallationCheckPass !== true) {
                            checkObj.remarks = isInstallationCheckPass;
                            sl.removeObj = true;
                        }

                        const isRangeExists = await isTransactionTypeRangeExists({
                            organizationId: sl.organizationId,
                            storeId: sl.storeId,
                            transactionTypeIds: { [Op.contains]: [data.transactionTypeId] },
                            isActive: "1"
                        });
                        if (!isRangeExists) {
                            checkObj.remarks = "Missing Transaction Type Range.";
                            sl.removeObj = true;
                        }
                    } else {
                        sl.removeObj = true;
                    }
                    if (checkObj.remarks !== "") checkArr.push(checkObj);
                } catch (error) {
                    if (checkObj.remarks !== "") checkArr.push(checkObj);
                    sl.removeObj = true;
                    // eslint-disable-next-line no-continue
                    continue;
                }
            }
            data.stock_ledgers = data.stock_ledgers.filter((sl) => sl.removeObj !== true);
        }
    }

    throwIfNot(groupedDataArr?.length, statusCodes.NOT_FOUND, "Data Import Failed.");

    for await (const data of groupedDataArr) {
        if (data.stock_ledgers.length > 0) {
            await createCtiTransaction({ body: data });
        }
    }

    return processExcelErrors(newErrorArr, columnNames, sheetName, checkArr);
};

const importItcTransactions = async (req) => {
    const { user: { userId } } = req;
    const uploadedFile = req.files.excelFile;
    const { resultArray, sheetName, columnNames, errorArr } = await processExcelFile(uploadedFile);
    const sheetNameLower = sheetName.toLowerCase();
    throwIfNot(sheetNameLower === "itc", statusCodes.NOT_FOUND, "Transaction Sheet Not Found.");
    const transactionTypeId = transactionsType[sheetNameLower];
    throwIfNot(resultArray?.length, statusCodes.NOT_FOUND, "No Data Found.");

    const requiredKeys = ["projectId", "storeId", "installerId", "materialId", "serialNo", "quantity"];
    const hasRequiredKeys = (obj) => requiredKeys.every((key) => Object.keys(obj).includes(key));
    const allObjectsHaveKeys = resultArray.every(hasRequiredKeys);
    throwIfNot(allObjectsHaveKeys, statusCodes.NOT_FOUND, "Invalid Data.");

    const newErrorArr = await checkErrorArray(errorArr);
    const filteredResultArray = await checkResultArray(resultArray);

    const groupedData = {};
    const handleNewItem = (key, item) => {
        const newItem = {
            transactionTypeId,
            projectId: item.projectId,
            storeId: item.storeId,
            materialId: item.materialId,
            quantity: item.quantity === "null" ? 1 : parseFloat(item.quantity.toFixed(3)),
            serialNumber: item.quantity === "null" && item.serialNo !== undefined && item.serialNo !== null ? [item.serialNo] : [],
            createdBy: userId,
            updatedBy: userId
        };
        groupedData[key].stock_ledgers.push(newItem);
    };

    filteredResultArray.forEach((item) => {
        const key = `${item.projectId}-${item.storeId}-${item.installerId}`;
        if (!groupedData[key]) {
            groupedData[key] = {
                transactionTypeId,
                installerId: item.installerId,
                createdBy: userId,
                updatedBy: userId,
                stock_ledgers: []
            };
        }
        const existingItemSerialize = groupedData[key].stock_ledgers.find((m) => m.materialId === item.materialId && item.quantity === "null" && item.serialNo !== "null");
        const existingItemNonSerialize = groupedData[key].stock_ledgers.find((m) => m.materialId === item.materialId && item.serialNo === "null" && Number(item.quantity) > 0);
        if (item.quantity === "null" && item.serialNo !== "null") {
            if (existingItemSerialize) {
                if (!existingItemSerialize.serialNumber.includes(item.serialNo)) existingItemSerialize.serialNumber.push(item.serialNo);
                existingItemSerialize.quantity = existingItemSerialize.serialNumber.length;
            } else {
                handleNewItem(key, item);
            }
        } else if (item.serialNo === "null" && Number(item.quantity) > 0) {
            if (existingItemNonSerialize) {
                existingItemNonSerialize.quantity += Number(item.quantity);
                existingItemNonSerialize.quantity = parseFloat(existingItemNonSerialize.quantity.toFixed(3));
            } else {
                handleNewItem(key, item);
            }
        }
    });

    const groupedDataArr = Object.values(groupedData);
    throwIfNot(groupedDataArr?.length, statusCodes.NOT_FOUND, "No Data Found.");

    const checkArr = [];
    for await (const data of groupedDataArr) {
        if (data.stock_ledgers.length > 0) {
            for await (const sl of data.stock_ledgers) {
                const checkObj = {
                    projectId: sl.projectId,
                    storeId: sl.storeId,
                    installerId: data.installerId,
                    materialId: sl.materialId,
                    quantity: sl.serialNumber.length > 0 ? "null" : sl.quantity,
                    serialNo: sl.serialNumber.length > 0 ? sl.serialNumber : "null",
                    remarks: ""
                };
                try {
                    const isProjectExists = await projectAlreadyExists({ id: sl.projectId });
                    if (!isProjectExists) checkObj.remarks = "Project Not Found.";
                    const isStoreExists = await organizationStoreAlreadyExists({ id: sl.storeId });
                    if (!isStoreExists) checkObj.remarks = "Store Not Found.";
                    const isMaterialExists = await materialAlreadyExists({ id: sl.materialId });
                    if (!isMaterialExists) checkObj.remarks = "Material Not Found.";

                    const storeDetails = await getOrganizationStoreByCondition({ id: sl.storeId });
                    const { organization } = storeDetails;
                    sl.organizationId = organization.parentId === null ? organization.id : organization.parent.id;

                    const isInstallerExists = await userAlreadyExists({ id: data.installerId, oraganizationId: sl.organizationId });
                    if (!isInstallerExists) checkObj.remarks = "Installer Not Found.";

                    if (isProjectExists && isStoreExists && isInstallerExists && isMaterialExists) {
                        const receivingStoreLocation = await getOrgStoreLocationByCondition({
                            name: { [Op.iLike]: "%receiving%" },
                            organizationStoreId: sl.storeId,
                            isActive: "1"
                        }, { order: [["createdAt", "DESC"]] });
                        if (!receivingStoreLocation) checkObj.remarks = "Receiving Store Location Not Found.";
                        sl.storeLocationId = receivingStoreLocation.id;
    
                        const installerStoreLocation = await getOrgStoreLocationByCondition({
                            name: { [Op.iLike]: "%installer%" },
                            organizationStoreId: sl.storeId,
                            isActive: "1"
                        }, { order: [["createdAt", "DESC"]] });
                        if (!installerStoreLocation) checkObj.remarks = "Installer Store Location Not Found.";
                        sl.fromStoreLocationId = installerStoreLocation.id;
    
                        const storeLocationData = await getAllStoreLocationTransactionData({
                            query: {
                                projectId: sl.projectId,
                                storeId: sl.storeId,
                                storeLocationId: sl.fromStoreLocationId,
                                installerId: data.installerId,
                                materialId: sl.materialId
                            }
                        });
                        if (!storeLocationData) checkObj.remarks = "Stock Not Found.";
    
                        const { allStoreLocationTransactionData: [{ material, uom, rate, tax, quantity }] } = storeLocationData;
                        sl.uomId = uom.id;
                        sl.rate = rate;
                        sl.tax = tax;
                        sl.value = sl.quantity * sl.rate;
    
                        if (material.isSerialNumber === true && sl.serialNumber.length === 0) {
                            sl.removeObj = true;
                        } else if (material.isSerialNumber === false && sl.serialNumber.length > 0) {
                            sl.removeObj = true;
                        }
    
                        if (material.isSerialNumber === true && sl.serialNumber.length > 0) {
                            const getActiveSerialNumbers = await getActiveSerialNumbersInStore({
                                query: {
                                    projectId: sl.projectId,
                                    storeId: sl.storeId,
                                    storeLocationId: sl.fromStoreLocationId,
                                    installerId: data.installerId,
                                    materialId: sl.materialId
                                }
                            });
                            if (getActiveSerialNumbers.count > 0) {
                                const tempSerialNumber = sl.serialNumber;
                                sl.serialNumber = sl.serialNumber.filter((serialNumber) => getActiveSerialNumbers.serialNumbersByMaterial[sl.materialId].includes(serialNumber));
                                sl.quantity = sl.serialNumber.length;
                                sl.value = sl.quantity * sl.rate;
                                checkObj.serialNo = tempSerialNumber.filter((serialNumber) => !getActiveSerialNumbers.serialNumbersByMaterial[sl.materialId].includes(serialNumber));
                                if (checkObj.serialNo.length > 0) checkObj.remarks = "Serial Number Not Found.";
                            } else {
                                checkObj.remarks = "Serial Number Not Found.";
                                sl.serialNumber = [];
                            }
                            if (sl.serialNumber.length === 0) sl.removeObj = true;
                        } else if (material.isSerialNumber === false && quantity < sl.quantity) {
                            checkObj.remarks = "Total Requested Quantity Not Available.";
                            sl.removeObj = true;
                        }

                        const isRangeExists = await isTransactionTypeRangeExists({
                            organizationId: sl.organizationId,
                            storeId: sl.storeId,
                            transactionTypeIds: { [Op.contains]: [data.transactionTypeId] },
                            isActive: "1"
                        });
                        if (!isRangeExists) {
                            checkObj.remarks = "Missing Transaction Type Range.";
                            sl.removeObj = true;
                        }
                    } else {
                        sl.removeObj = true;
                    }
                    if (checkObj.remarks !== "") checkArr.push(checkObj);
                } catch (error) {
                    if (checkObj.remarks !== "") checkArr.push(checkObj);
                    sl.removeObj = true;
                    // eslint-disable-next-line no-continue
                    continue;
                }
            }
            data.stock_ledgers = data.stock_ledgers.filter((sl) => sl.removeObj !== true);
        }
    }

    throwIfNot(groupedDataArr?.length, statusCodes.NOT_FOUND, "Data Import Failed.");

    for await (const data of groupedDataArr) {
        if (data.stock_ledgers.length > 0) {
            await createCtiTransaction({ body: data });
        }
    }

    return processExcelErrors(newErrorArr, columnNames, sheetName, checkArr);
};

const importItiTransactions = async (req) => {
    const { user: { userId } } = req;
    const uploadedFile = req.files.excelFile;
    const { resultArray, sheetName, columnNames, errorArr } = await processExcelFile(uploadedFile);
    const sheetNameLower = sheetName.toLowerCase();
    throwIfNot(sheetNameLower === "iti", statusCodes.NOT_FOUND, "Transaction Sheet Not Found.");

    errorArr.forEach((obj) => {
        if (obj.remarks === "Success" && obj.fromInstallerId === obj.toInstallerId) {
            obj.remarks = "Same fromInstallerId and toInstallerId";
        }
    });

    const filteredResultArray = (resultArray.length && resultArray.filter((obj) => obj.fromInstallerId !== obj.toInstallerId)) || [];
    throwIfNot(filteredResultArray?.length, statusCodes.NOT_FOUND, "No Data Found.");

    const requiredKeys = ["projectId", "storeId", "fromInstallerId", "toInstallerId", "materialId", "serialNo", "quantity"];
    const hasRequiredKeys = (obj) => requiredKeys.every((key) => Object.keys(obj).includes(key));
    const allObjectsHaveKeys = filteredResultArray.every(hasRequiredKeys);
    throwIfNot(allObjectsHaveKeys, statusCodes.NOT_FOUND, "Invalid Data.");

    const newErrorArr = await checkErrorArray(errorArr);
    const newFilteredResultArray = await checkResultArray(filteredResultArray);

    const groupedData = {};
    const handleNewItem = (key, item) => {
        const newItem = {
            transactionTypeId: transactionsType.cti,
            projectId: item.projectId,
            storeId: item.storeId,
            materialId: item.materialId,
            quantity: item.quantity === "null" ? 1 : parseFloat(item.quantity.toFixed(3)),
            serialNumber: item.quantity === "null" && item.serialNo !== undefined && item.serialNo !== null ? [item.serialNo] : [],
            createdBy: userId,
            updatedBy: userId
        };
        groupedData[key].stock_ledgers.push(newItem);
    };

    newFilteredResultArray.forEach((item) => {
        const key = `${item.projectId}-${item.storeId}-${item.fromInstallerId}-${item.toInstallerId}`;
        if (!groupedData[key]) {
            groupedData[key] = {
                transactionTypeId: transactionsType.itc,
                fromInstallerId: item.fromInstallerId,
                toInstallerId: item.toInstallerId,
                createdBy: userId,
                updatedBy: userId,
                stock_ledgers: []
            };
        }
        const existingItemSerialize = groupedData[key].stock_ledgers.find((m) => m.materialId === item.materialId && item.quantity === "null" && item.serialNo !== "null");
        const existingItemNonSerialize = groupedData[key].stock_ledgers.find((m) => m.materialId === item.materialId && item.serialNo === "null" && Number(item.quantity) > 0);
        if (item.quantity === "null" && item.serialNo !== "null") {
            if (existingItemSerialize) {
                if (!existingItemSerialize.serialNumber.includes(item.serialNo)) existingItemSerialize.serialNumber.push(item.serialNo);
                existingItemSerialize.quantity = existingItemSerialize.serialNumber.length;
            } else {
                handleNewItem(key, item);
            }
        } else if (item.serialNo === "null" && Number(item.quantity) > 0) {
            if (existingItemNonSerialize) {
                existingItemNonSerialize.quantity += Number(item.quantity);
                existingItemNonSerialize.quantity = parseFloat(existingItemNonSerialize.quantity.toFixed(3));
            } else {
                handleNewItem(key, item);
            }
        }
    });

    const groupedDataArr = Object.values(groupedData);
    throwIfNot(groupedDataArr?.length, statusCodes.NOT_FOUND, "No Data Found.");

    const checkArr = [];
    for await (const data of groupedDataArr) {
        if (data.stock_ledgers.length > 0) {
            for await (const sl of data.stock_ledgers) {
                const checkObj = {
                    projectId: sl.projectId,
                    storeId: sl.storeId,
                    fromInstallerId: data.fromInstallerId,
                    toInstallerId: data.toInstallerId,
                    materialId: sl.materialId,
                    quantity: sl.serialNumber.length > 0 ? "null" : sl.quantity,
                    serialNo: sl.serialNumber.length > 0 ? sl.serialNumber : "null",
                    remarks: ""
                };
                try {
                    const isProjectExists = await projectAlreadyExists({ id: sl.projectId });
                    if (!isProjectExists) checkObj.remarks = "Project Not Found.";
                    const isStoreExists = await organizationStoreAlreadyExists({ id: sl.storeId });
                    if (!isStoreExists) checkObj.remarks = "Store Not Found.";
                    const isMaterialExists = await materialAlreadyExists({ id: sl.materialId });
                    if (!isMaterialExists) checkObj.remarks = "Material Not Found.";

                    const storeDetails = await getOrganizationStoreByCondition({ id: sl.storeId });
                    const { organization } = storeDetails;
                    sl.organizationId = organization.parentId === null ? organization.id : organization.parent.id;

                    const isFromInstallerExists = await userAlreadyExists({ id: data.fromInstallerId, oraganizationId: sl.organizationId });
                    if (!isFromInstallerExists) checkObj.remarks = "From Installer Not Found.";
                    const isToInstallerExists = await userAlreadyExists({ id: data.toInstallerId, oraganizationId: sl.organizationId });
                    if (!isToInstallerExists) checkObj.remarks = "To Installer Not Found.";

                    if (isProjectExists && isStoreExists && isFromInstallerExists && isToInstallerExists && isMaterialExists) {
                        const receivingStoreLocation = await getOrgStoreLocationByCondition({
                            name: { [Op.iLike]: "%receiving%" },
                            organizationStoreId: sl.storeId,
                            isActive: "1"
                        }, { order: [["createdAt", "DESC"]] });
                        if (!receivingStoreLocation) checkObj.remarks = "Receiving Store Location Not Found.";
                        sl.receivingStoreLocationId = receivingStoreLocation.id;
    
                        const installerStoreLocation = await getOrgStoreLocationByCondition({
                            name: { [Op.iLike]: "%installer%" },
                            organizationStoreId: sl.storeId,
                            isActive: "1"
                        }, { order: [["createdAt", "DESC"]] });
                        if (!installerStoreLocation) checkObj.remarks = "Installer Store Location Not Found.";
                        sl.storeLocationId = installerStoreLocation.id;
                        sl.fromStoreLocationId = installerStoreLocation.id;
    
                        const storeLocationData = await getAllStoreLocationTransactionData({
                            query: {
                                projectId: sl.projectId,
                                storeId: sl.storeId,
                                storeLocationId: sl.fromStoreLocationId,
                                installerId: data.fromInstallerId,
                                materialId: sl.materialId
                            }
                        });
                        if (!storeLocationData) checkObj.remarks = "Stock Not Found.";
    
                        const { allStoreLocationTransactionData: [{ material, uom, rate, tax, quantity }] } = storeLocationData;
                        sl.uomId = uom.id;
                        sl.rate = rate;
                        sl.tax = tax;
                        sl.value = sl.quantity * sl.rate;
    
                        if (material.isSerialNumber === true && sl.serialNumber.length === 0) {
                            sl.removeObj = true;
                        } else if (material.isSerialNumber === false && sl.serialNumber.length > 0) {
                            sl.removeObj = true;
                        }
    
                        if (material.isSerialNumber === true && sl.serialNumber.length > 0) {
                            const getActiveSerialNumbers = await getActiveSerialNumbersInStore({
                                query: {
                                    projectId: sl.projectId,
                                    storeId: sl.storeId,
                                    storeLocationId: sl.fromStoreLocationId,
                                    installerId: data.fromInstallerId,
                                    materialId: sl.materialId
                                }
                            });
                            if (getActiveSerialNumbers.count > 0) {
                                const tempSerialNumber = sl.serialNumber;
                                sl.serialNumber = sl.serialNumber.filter((serialNumber) => getActiveSerialNumbers.serialNumbersByMaterial[sl.materialId].includes(serialNumber));
                                sl.quantity = sl.serialNumber.length;
                                sl.value = sl.quantity * sl.rate;
                                checkObj.serialNo = tempSerialNumber.filter((serialNumber) => !getActiveSerialNumbers.serialNumbersByMaterial[sl.materialId].includes(serialNumber));
                                if (checkObj.serialNo.length > 0) checkObj.remarks = "Serial Number Not Found.";
                            } else {
                                checkObj.remarks = "Serial Number Not Found.";
                                sl.serialNumber = [];
                            }
                            if (sl.serialNumber.length === 0) sl.removeObj = true;
                        } else if (material.isSerialNumber === false && quantity < sl.quantity) {
                            checkObj.remarks = "Total Requested Quantity Not Available.";
                            sl.removeObj = true;
                        }

                        const isItcRangeExists = await isTransactionTypeRangeExists({
                            organizationId: sl.organizationId,
                            storeId: sl.storeId,
                            transactionTypeIds: { [Op.contains]: [transactionsType.itc] },
                            isActive: "1"
                        });
                        const isCtiRangeExists = await isTransactionTypeRangeExists({
                            organizationId: sl.organizationId,
                            storeId: sl.storeId,
                            transactionTypeIds: { [Op.contains]: [transactionsType.cti] },
                            isActive: "1"
                        });
                        if (!isItcRangeExists || !isCtiRangeExists) {
                            checkObj.remarks = "Missing Transaction Type Range.";
                            sl.removeObj = true;
                        }
                    } else {
                        sl.removeObj = true;
                    }
                    if (checkObj.remarks !== "") checkArr.push(checkObj);
                } catch (error) {
                    if (checkObj.remarks !== "") checkArr.push(checkObj);
                    sl.removeObj = true;
                    // eslint-disable-next-line no-continue
                    continue;
                }
            }
            data.stock_ledgers = data.stock_ledgers.filter((sl) => sl.removeObj !== true);
        }
    }

    throwIfNot(groupedDataArr?.length, statusCodes.NOT_FOUND, "Data Import Failed.");

    for await (const data of groupedDataArr) {
        if (data.stock_ledgers.length > 0) {
            await createItiTransaction({ body: data });
        }
    }

    return processExcelErrors(newErrorArr, columnNames, sheetName, checkArr);
};

module.exports = {
    exportTransactionsSchemaFile,
    importCtiTransactions,
    importItcTransactions,
    importItiTransactions
};
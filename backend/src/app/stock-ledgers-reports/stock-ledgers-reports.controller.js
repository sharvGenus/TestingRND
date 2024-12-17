const { Op } = require("sequelize");
const stockLedgerService = require("./stock-ledgers-reports.service");
const { getAllMaterialsForReport, getAllMaterialsNoLimit } = require("../materials/materials.service");
const { calculateOffsetAndLimit } = require("../../utilities/common-utils");
const { getOrgStoreLocationByCondition } = require("../organization-store-locations/organization-store-locations.service");
const StockLedgers = require("../../database/operation/stock-ledgers");

const transactionTypeId = {
    GRN: "3bf4cfe9-0ba0-4ba5-bd66-bfae7eecfeaf",
    MIN: "ac909ed3-92c2-4cdf-b463-0e351c42cda2",
    CTI: "5b4e46d5-7bf5-4f42-8c4a-b6337533fdff",
    ITC: "799ee00c-0819-498a-9e47-3ac269f33db8",
    MRN: "fc1015da-7db4-4aa6-844d-92a5557f7941",
    STO: "fadec802-92aa-4127-8ba1-e3d9b6bd4936",
    STOGRN: "c69c9f62-c3fc-4703-95d4-dd3a5227e010",
    PTP: "22ce5829-2a1e-407c-88f6-5ebc38455519",
    PTPGRN: "c384a987-d92c-481f-9223-605dd3d05338",
    INSTALLED: "f3848838-6e7c-4240-a4e2-27e084164a17",
    CANCELINSTALLED: "923fa9a0-5ed5-4bc2-9946-dad0da5f34c4",
    OLDMETER: "cb92ec5a-3f86-48cf-86b8-9359dda410a5",
    CANCELOLDMETER: "79f09003-a389-4a81-abd8-43b77a5f914b"
};

const organizationTypeId = {
    COMPANY: "420e7b13-25fd-4d23-9959-af1c07c7e94b",
    CONTRACTOR: "decb6c57-6d85-4f83-9cc2-50e0630003df"
};

const materialId = {
    OLDMETER: "84b473e1-62bb-4afe-af56-1691bdffbc55"
};

/**
 * Method to get all delivery report details
 * @returns { object } data
 */
const getAllDeliveryReportDetails = async (req) => {
    const where = {};
    const associationWhere = {};
    if (req.query && req.query.transactionTypeId) {
        where.transactionTypeId = req.query.transactionTypeId;
    }
    if (req.query && req.query.fromDate && req.query.toDate) {
        where.createdAt = {
            [Op.between]: [req.query.fromDate, req.query.toDate]
        };
    }
    if (req.query && req.query.storeId) {
        associationWhere.storeId = req.query.storeId;
    }
    if (req.query && req.query.projectId) {
        associationWhere.projectId = req.query.projectId;
    }
    const data = await stockLedgerService.getAllStockLedgerDetailsWithAssociation(associationWhere, where);
    return { data };
};

/**
 * Method to get all Contractor Reconciliation report details
 * @returns { object } data
 */
const getAllContractorReconciliationReportDetails = async (req) => {
    const associationWhere = {};
    if (req.query && req.query.projectId) {
        associationWhere.projectId = req.query.projectId;
    }
    if (req.query && req.query.organizationId) {
        associationWhere.organizationId = req.query.organizationId;
    }
    if (req.query && req.query.storeId) {
        associationWhere.storeId = req.query.storeId;
    }
    const data = await stockLedgerService.getAllStockLedgerDetailsWithAssociation(associationWhere, {});
    return { data };
};

/**
 * Method to get all Contractor Report report details
 * @returns { object } data
 */
const getAllContractorReportDetails = async (req) => {
    const associationWhere = {};
    if (req.query && req.query.projectId) {
        associationWhere.projectId = req.query.projectId;
    }
    if (req.query && req.query.organizationId) {
        associationWhere.organizationId = req.query.organizationId;
    }
    if (req.query && req.query.storeId) {
        associationWhere.storeId = req.query.storeId;
    }
    if (req.query && req.query.materialId) {
        associationWhere.materialId = req.query.materialId;
    }
    const data = await stockLedgerService.getAllStockLedgerDetailsWithAssociation(associationWhere, {});
    return { data };
};

/**
 * Method to get all Stock Report report details
 * @returns { object } data
 */
const getAllReportForStock = async (req) => {
    const associationWhere = {};
    if (req.query && req.query.projectId) {
        associationWhere.projectId = req.query.projectId;
    }
    if (req.query && req.query.organizationId) {
        associationWhere.organizationId = req.query.organizationId;
    }
    if (req.query && req.query.storeId) {
        associationWhere.storeId = req.query.storeId;
    }
    const data = await stockLedgerService.getAllStockLedgerDetailsWithAssociation(associationWhere, {});
    return { data };
};

/**
 * Method to get all Aging of Material Report report details
 * @returns { object } data
 */
const getAllAgingOfMaterialReport = async (req) => stockLedgerService.executeAgingMaterialReportQuery(req, stockLedgerService.createAgingMaterialReportQuery);

/**
 * Method to get all Aging of Material Sub-Report report details
 * @returns { object } data
 */
const getAllAgingOfMaterialSubReport = async (req) => stockLedgerService.executeAgingMaterialReportQuery(req, stockLedgerService.createAgingMaterialSubReportQuery);

/**
 * Method to get all Aging of Material Serial Numbers report details
 * @returns { object } data
 */
const getAllAgingOfMaterialSerialNumbers = async (req) => stockLedgerService.executeAgingMaterialReportQuery(req, stockLedgerService.createAgingMaterialSerialNumbersQuery);
 
const getDateWiseProductivityReport = async (req) => {
    const { projectId, formId, formType, gaaLevelDetails, dateFrom, dateTo } = req.query;
    const { limit, offset } = calculateOffsetAndLimit(req.query);
    const data = await stockLedgerService.getDateWiseProductivityReport({ projectId, formId, formType, gaaLevelDetails, dateFrom, dateTo, limit, offset });
    return { data };
};

const getValidationStatusReport = async (req) => {
    const { formId, approver, projectId, formType, gaaLevelDetails, dateFrom, dateTo } = req.query;
    const { limit, offset } = calculateOffsetAndLimit(req.query);
    const data = await stockLedgerService.validationStatusReport({ projectId, formId, approver, formType, gaaLevelDetails, dateFrom, dateTo, limit, offset });
    return { data };
};

const stockReport = async (req) => {
    const where = {};
    const { projectId, storeId, storeLocationId, materialId, installerId } = req.query;
    if (projectId) where.projectId = projectId;
    if (storeId) where.storeId = storeId;
    if (storeLocationId) where.storeLocationId = storeLocationId;
    if (materialId) where.materialId = materialId;
    if (installerId) where.installerId = installerId;

    const data = await stockLedgerService.getTxnsForStockReport(where);
    
    const allStoreLocationTransactionData = [];
    if (data && data.count > 0) {
        const groupByStoreObject = data.rows.reduce((group, arr) => {
            const { storeLocationId, materialId } = arr;
            group[storeLocationId + materialId] = group[storeLocationId + materialId] ?? [];
            group[storeLocationId + materialId].push(arr);
            return group;
        }, {});
        for (const value of Object.values(groupByStoreObject)) {
            let quantity = 0;
            let totalValue = 0;
            let materialInStore = {};
            for (const val of value) {
                quantity += val.quantity;
                totalValue += val.quantity < 0 ? -val.value : val.value;
                materialInStore = {
                    storeLocationId: val.storeLocationId,
                    storeLocation: val.organization_store_location,
                    materialId: val.materialId,
                    material: val.material,
                    uom: val.uom,
                    tax: val.tax,
                    quantity: parseFloat(quantity.toFixed(3)),
                    rate: quantity === 0 ? val.rate : totalValue / quantity,
                    value: quantity === 0 ? 0 : totalValue
                };
            }
            const totalMaterial = JSON.parse(JSON.stringify(materialInStore));
            allStoreLocationTransactionData.push(totalMaterial);
        }
    }
    return { allStoreLocationTransactionData };
};

/**
 * Method to get material type list for report
 * @param { object } req.body
 * @returns { object } data
 */
const getMaterialTypesForReport = async (req) => {
    const { db } = new StockLedgers();
    const { projectId, contractorId, storeId } = req.query;
    let where = "";

    const addCondition = (column, value) => {
        if (Array.isArray(value)) {
            if (value.length > 0) {
                const formattedValue = value.map((item) => `'${item}'`).join(",");
                where += ` AND sl.${column} IN (${formattedValue})`;
            }
        } else {
            where += ` AND sl.${column} = '${value}'`;
        }
    };

    if (projectId) addCondition("project_id", projectId);
    if (contractorId) addCondition("organization_id", contractorId);
    if (storeId) addCondition("store_id", storeId);

    const sqlQuery = `SELECT DISTINCT mml.id, mml.name FROM master_maker_lovs AS mml INNER JOIN materials AS m ON m.material_type_id = mml.id WHERE mml.master_id = '1d9dc597-5070-48c4-b135-9db6c503aed1' AND m.is_serial_number = true AND EXISTS (SELECT 1 FROM stock_ledgers AS sl WHERE sl.material_id = m.id ${where})`;
    const [rows] = await db.sequelize.selectQuery(sqlQuery);

    return { materialTypeArr: rows };
};

/**
 * Method to get store wise material summary report details
 * @param { object } req.body
 * @returns { object } data
 */
const storeWiseMaterialSummaryReport = async (req) => {
    const where = {
        transactionTypeId: [transactionTypeId.GRN, transactionTypeId.STOGRN, transactionTypeId.STO, transactionTypeId.PTP, transactionTypeId.PTPGRN],
        isCancelled: false
    };
    const { projectId, storeId, materialTypeId } = req.query;
    if (projectId) where.projectId = projectId;
    if (storeId) where.storeId = storeId;
    if (materialTypeId) {
        const materialsData = await getAllMaterialsForReport({ materialTypeId: materialTypeId, id: { [Op.ne]: materialId.OLDMETER } });

        if (materialsData && materialsData.count > 0) {
            where.materialId = materialsData.rows.map((row) => row.id);
        }
    }

    const data = await stockLedgerService.getAllTransactions(where);

    const storeWiseMaterial = [];

    if (data && data.count > 0) {
        const groupByMaterialObject = data.rows.reduce((group, arr) => {
            const { material, storeId, organization_store: store } = arr;
            if (store.organizationType === organizationTypeId.COMPANY && material.isSerialNumber) {
                group[storeId] = group[storeId] ?? {};
                group[storeId][material.materialTypeId] = group[storeId][material.materialTypeId] ?? [];
                group[storeId][material.materialTypeId].push(arr);
            }
            return group;
        }, {});

        Object.entries(groupByMaterialObject).forEach(([storeId, outerValue]) => {
            Object.entries(outerValue).forEach(([materialTypeId, innerValue]) => {
                const totalQuantity = innerValue.reduce((total, value) => total + value.quantity, 0);
                const materialIds = innerValue.map((value) => value.materialId);
                const { project, organization_store: store, material } = innerValue[0];
                storeWiseMaterial.push({
                    project: project.name,
                    projectId,
                    store: store.name,
                    storeId,
                    materialType: material.material_type.name,
                    materialTypeId,
                    materialIds,
                    receivedAtStore: totalQuantity
                });
            });
        });

        if (storeWiseMaterial.length > 0) {
            for await (const obj of storeWiseMaterial) {
                obj.receivedAtContractor = 0;
                obj.receivedAtInstaller = 0;
                obj.installed = 0;
                obj.availableAtStore = 0;
                obj.availableAtContractor = 0;
                obj.availableAtInstaller = 0;

                const { projectId, storeId, materialIds } = obj;

                // Available at company store
                const companyStoreTxns = await stockLedgerService.getAllTransactions({
                    projectId,
                    storeId,
                    materialId: materialIds,
                    transactionTypeId: { [Op.notIn]: [
                        transactionTypeId.INSTALLED,
                        transactionTypeId.CANCELINSTALLED,
                        transactionTypeId.OLDMETER,
                        transactionTypeId.CANCELOLDMETER
                    ] },
                    installerId: null
                });

                if (companyStoreTxns && companyStoreTxns.count > 0) {
                    obj.availableAtStore = companyStoreTxns.rows.reduce((total, txn) => total + txn.quantity, 0);
                }

                // Available at company installer
                const companyInstalledStoreLocation = await getOrgStoreLocationByCondition({ name: { [Op.iLike]: "%installed%" }, organizationStoreId: storeId, isActive: "1" }, { order: [["createdAt", "DESC"]] });

                const companyInstallerTxns = await stockLedgerService.getAllTransactions({
                    projectId,
                    storeId,
                    materialId: materialIds,
                    installerId: { [Op.ne]: null },
                    transactionTypeId: {
                        [Op.notIn]: [
                            transactionTypeId.OLDMETER,
                            transactionTypeId.CANCELOLDMETER
                        ]
                    },
                    ...(companyInstalledStoreLocation?.id && { storeLocationId: { [Op.notIn]: [companyInstalledStoreLocation.id] } })
                });

                if (companyInstallerTxns && companyInstallerTxns.count > 0) {
                    obj.availableAtInstaller = companyInstallerTxns.rows.reduce((total, txn) => total + txn.quantity, 0);
                }

                // Received at company installer
                const compCtiItcTxns = await stockLedgerService.getAllTransactions({ projectId, transactionTypeId: [transactionTypeId.CTI, transactionTypeId.ITC], storeId, materialId: materialIds, installerId: { [Op.ne]: null } });

                if (compCtiItcTxns && compCtiItcTxns.count > 0) {
                    obj.receivedAtInstaller = compCtiItcTxns.rows.reduce((total, txn) => total + txn.quantity, 0);

                    // Installed by company installer
                    const compInstalledTxns = await stockLedgerService.getAllTransactions({
                        projectId,
                        transactionTypeId: [transactionTypeId.INSTALLED, transactionTypeId.CANCELINSTALLED],
                        storeId,
                        materialId: materialIds,
                        installerId: { [Op.ne]: null },
                        ...(companyInstalledStoreLocation?.id && { storeLocationId: { [Op.notIn]: [companyInstalledStoreLocation.id] } })
                    });

                    if (compInstalledTxns && compInstalledTxns.count > 0) {
                        obj.installed = Math.abs(compInstalledTxns.rows.reduce((total, txn) => total + txn.quantity, 0));
                    }
                }

                // Available at contractor
                const minTxns = await stockLedgerService.getAllTransactions({ projectId, transactionTypeId: transactionTypeId.MIN, storeId, materialId: materialIds, quantity: { [Op.lt]: 0 }, isCancelled: false });
                
                if (minTxns && minTxns.count > 0) {
                    const contractorStores = minTxns.rows.map((txn) => txn.otherStoreId ?? txn.stock_ledger_detail.toStoreId);
                
                    if (contractorStores.length > 0) {
                        const contractorStoreTxns = await stockLedgerService.getAllTransactions({ projectId, storeId: contractorStores, materialId: materialIds, installerId: null });

                        if (contractorStoreTxns && contractorStoreTxns.count > 0) {
                            obj.availableAtContractor = contractorStoreTxns.rows.reduce((total, txn) => total + txn.quantity, 0);
                        }

                        // Available at installer
                        const installerTxns = await stockLedgerService.getAllTransactions({ projectId, storeId: contractorStores, materialId: materialIds, installerId: { [Op.ne]: null }, transactionTypeId: { [Op.notIn]: [transactionTypeId.OLDMETER, transactionTypeId.CANCELOLDMETER] } });

                        if (installerTxns && installerTxns.count > 0) {
                            obj.availableAtInstaller += installerTxns.rows.reduce((total, txn) => total + txn.quantity, 0);
                        }

                        // Received at contractor
                        const grnAtMinAndMrnTxns = await stockLedgerService.getAllTransactions({ projectId, transactionTypeId: [transactionTypeId.GRN, transactionTypeId.MRN], requestNumber: { [Op.ne]: null }, storeId: contractorStores, materialId: materialIds, isCancelled: false });

                        if (grnAtMinAndMrnTxns && grnAtMinAndMrnTxns.count > 0) {
                            obj.receivedAtContractor = grnAtMinAndMrnTxns.rows.reduce((total, txn) => total + txn.quantity, 0);
                        }

                        // Received at installer
                        const ctiItcTxns = await stockLedgerService.getAllTransactions({ projectId, transactionTypeId: [transactionTypeId.CTI, transactionTypeId.ITC], storeId: contractorStores, materialId: materialIds, installerId: { [Op.ne]: null } });

                        if (ctiItcTxns && ctiItcTxns.count > 0) {
                            obj.receivedAtInstaller += ctiItcTxns.rows.reduce((total, txn) => total + txn.quantity, 0);

                            // Installed
                            const installedTxns = await stockLedgerService.getAllTransactions({ projectId, transactionTypeId: [transactionTypeId.INSTALLED, transactionTypeId.CANCELINSTALLED], storeId: contractorStores, materialId: materialIds, installerId: { [Op.ne]: null } });

                            if (installedTxns && installedTxns.count > 0) {
                                obj.installed += Math.abs(installedTxns.rows.reduce((total, txn) => total + txn.quantity, 0));
                            }
                        }
                    }
                }
                const propertiesToDelete = ["projectId", "storeId", "materialTypeId", "materialIds"];
                propertiesToDelete.forEach((key) => delete obj[key]);
            }
        }
    }

    return { storeWiseMaterial };
};

/**
 * Method to get contractor wise material summary report details
 * @param { object } req.body
 * @returns { object } data
 */
const contractorWiseMaterialSummaryReport = async (req) => {
    const where = {
        transactionTypeId: [transactionTypeId.GRN, transactionTypeId.MRN],
        requestNumber: { [Op.ne]: null },
        isCancelled: false
    };
    const { projectId, contractorId, storeId, materialTypeId } = req.query;
    if (projectId) where.projectId = projectId;
    if (contractorId) where.organizationId = contractorId;
    if (storeId) where.storeId = storeId;
    if (materialTypeId) {
        const materialsData = await getAllMaterialsForReport({ materialTypeId: materialTypeId, id: { [Op.ne]: materialId.OLDMETER } });
        
        if (materialsData && materialsData.count > 0) {
            where.materialId = materialsData.rows.map((row) => row.id);
        }
    }

    const data = await stockLedgerService.getAllTransactions(where);

    const storeWiseMaterial = [];

    if (data && data.count > 0) {
        const groupByMaterialObject = data.rows.reduce((group, arr) => {
            const { material, organizationId, storeId, organization_store: store } = arr;
            if (store.organizationType === organizationTypeId.CONTRACTOR && material.isSerialNumber) {
                group[organizationId] = group[organizationId] ?? {};
                group[organizationId][storeId] = group[organizationId][storeId] ?? {};
                group[organizationId][storeId][material.materialTypeId] = group[organizationId][storeId][material.materialTypeId] ?? [];
                group[organizationId][storeId][material.materialTypeId].push(arr);
            }
            return group;
        }, {});

        Object.entries(groupByMaterialObject).forEach(([organizationId, mostOuterValue]) => {
            Object.entries(mostOuterValue).forEach(([storeId, outerValue]) => {
                Object.entries(outerValue).forEach(([materialTypeId, innerValue]) => {
                    const totalQuantity = innerValue.reduce((total, value) => total + value.quantity, 0);
                    const materialIds = innerValue.map((value) => value.materialId);
                    const { project, organization, organization_store: store, material } = innerValue[0];
                    storeWiseMaterial.push({
                        project: project.name,
                        projectId,
                        contractorName: organization.name,
                        contractorId: organizationId,
                        store: store.name,
                        storeId,
                        materialType: material.material_type.name,
                        materialTypeId,
                        materialIds,
                        receivedAtContractor: totalQuantity
                    });
                });
            });
        });

        if (storeWiseMaterial.length > 0) {
            for await (const obj of storeWiseMaterial) {
                obj.receivedAtInstaller = 0;
                obj.installed = 0;
                obj.availableAtContractor = 0;
                obj.availableAtInstaller = 0;

                const { projectId, contractorId, storeId, materialIds } = obj;

                // Available at contractor
                const contractorStoreTxns = await stockLedgerService.getAllTransactions({ projectId, organizationId: contractorId, storeId: storeId, materialId: materialIds, installerId: null });

                if (contractorStoreTxns && contractorStoreTxns.count > 0) {
                    obj.availableAtContractor = contractorStoreTxns.rows.reduce((total, txn) => total + txn.quantity, 0);
                }

                // Available at installer
                const installerTxns = await stockLedgerService.getAllTransactions({
                    projectId,
                    organizationId: contractorId,
                    storeId: storeId,
                    materialId: materialIds,
                    installerId: { [Op.ne]: null },
                    transactionTypeId: {
                        [Op.notIn]: [
                            transactionTypeId.OLDMETER,
                            transactionTypeId.CANCELOLDMETER
                        ]
                    }
                });

                if (installerTxns && installerTxns.count > 0) {
                    obj.availableAtInstaller = installerTxns.rows.reduce((total, txn) => total + txn.quantity, 0);
                }

                // Received at installer
                const ctiItcTxns = await stockLedgerService.getAllTransactions({ projectId, transactionTypeId: [transactionTypeId.CTI, transactionTypeId.ITC], organizationId: contractorId, storeId: storeId, materialId: materialIds, installerId: { [Op.ne]: null } });

                if (ctiItcTxns && ctiItcTxns.count > 0) {
                    obj.receivedAtInstaller = ctiItcTxns.rows.reduce((total, txn) => total + txn.quantity, 0);

                    // Installed
                    const installedTxns = await stockLedgerService.getAllTransactions({ projectId, transactionTypeId: [transactionTypeId.INSTALLED, transactionTypeId.CANCELINSTALLED], organizationId: contractorId, storeId: storeId, materialId: materialIds, installerId: { [Op.ne]: null } });

                    if (installedTxns && installedTxns.count > 0) {
                        obj.installed = Math.abs(installedTxns.rows.reduce((total, txn) => total + txn.quantity, 0));
                    }
                }

                const propertiesToDelete = ["projectId", "contractorId", "storeId", "materialTypeId", "materialIds"];
                propertiesToDelete.forEach((key) => delete obj[key]);
            }
        }
    }

    return { storeWiseMaterial };
};

const getExecutiveDashboard = async (req) => {
    const { projectId } = req.query;
    const data = await stockLedgerService.getExecutiveDashboard({ projectId });
    return { data };
};

const getAreaWiseProgressDashboard = async (req) => {
    const { gaaLevelDetails, projectId, fromDate, toDate, activityType } = req.query;
    const data = await stockLedgerService.getAreaWiseProgressDashboard({ gaaLevelDetails, projectId, fromDate, toDate, activityType });
    return { data };
};

const getContractorDashboard = async (req) => {
    const { projectId, meterTypeId } = req.query;
    const data = await stockLedgerService.getContractorDashboard({ projectId, meterTypeId });
    return { data };
};

const getProjectSummaryDashboard = async (req) => {
    const { projectId, dateTimeFrom, dateTimeTo, cumulativeStatusOnly } = req.query;
    const data = await stockLedgerService.getProjectSummaryDashboard({ projectId, dateTimeFrom, dateTimeTo, cumulativeStatusOnly });
    return { data };
};

const getSupervisorDashboard = async (req) => {
    const { projectId, dateTimeFrom, dateTimeTo, cumulativeStatusOnly, taskType } = req.query;
    const { userId, isSuperUser } = req.user;
    const data = await stockLedgerService.getSupervisorDashboard({ projectId, dateTimeFrom, dateTimeTo, cumulativeStatusOnly, taskType, userId, isSuperUser });
    return { data };
};

const materialGrnReport = async (req) => {
    const where = {
        "$stock_ledger.transaction_type_id$": transactionTypeId.GRN,
        "$stock_ledger.request_number$": null,
        "$stock_ledger.is_cancelled$": false
    };
    const { projectId, materialTypeId, itemSerialNoFrom, itemSerialNoTo, dateFrom, dateTo } = req.query;
    if (projectId) where["$stock_ledger.project_id$"] = projectId;
    if (materialTypeId) {
        const materialsData = await getAllMaterialsNoLimit({ materialTypeId: materialTypeId, id: { [Op.ne]: materialId.OLDMETER } });
        if (materialsData && materialsData.count > 0) {
            where.materialId = materialsData.rows.map((row) => row.id);
        }
    }
    if (dateFrom && dateTo) where.createdAt = { [Op.between]: [dateFrom, dateTo] };
    if (itemSerialNoFrom && itemSerialNoTo) where.serialNumber = { [Op.between]: [itemSerialNoFrom, itemSerialNoTo] };
    const data = await stockLedgerService.getGrnSerialNumbers(where);
    return { data };
};

const getProjectSummaryReport = async (req) => {
    const { pageNumber, rowPerPage, pagination } = req.query;
    const { projectId, dateFrom: fromDate, dateTo: toDate, gaaHierarchyDetails } = req.body;
    const { gaaColumnName, gaaColumnValue } = (gaaHierarchyDetails) || "";
    const page = false;

    const data = await stockLedgerService.getProjectSummaryReport({ projectId, pagination, fromDate, toDate, gaaColumnName, gaaColumnValue, pageNumber, rowPerPage });
    const dataCount = (await stockLedgerService.getProjectSummaryReport({ projectId, page, fromDate, toDate, gaaColumnName, gaaColumnValue }))?.length;

    return { data: { count: dataCount, rows: data } };
};

module.exports = {
    getAllDeliveryReportDetails,
    getAllContractorReconciliationReportDetails,
    getAllContractorReportDetails,
    getAllReportForStock,
    getAllAgingOfMaterialReport,
    getAllAgingOfMaterialSubReport,
    stockReport,
    getMaterialTypesForReport,
    storeWiseMaterialSummaryReport,
    contractorWiseMaterialSummaryReport,
    getAllAgingOfMaterialSerialNumbers,
    getDateWiseProductivityReport,
    getValidationStatusReport,
    getExecutiveDashboard,
    getAreaWiseProgressDashboard,
    getContractorDashboard,
    getProjectSummaryDashboard,
    getSupervisorDashboard,
    materialGrnReport,
    getProjectSummaryReport
};

const { throwIfNot, throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const purchaseOrderService = require("./purchase-orders.service");

/**
 * Method to create purchase orders
 * @param { object } req.body
 * @returns { object } data
 */
const createPurchaseOrder = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_PURCHASE_ORDER_DETAILS);
    throwIfNot(req.body.materials, statusCodes.BAD_REQUEST, statusMessages.MISSING_PURCHASE_ORDER_DETAILS);
    if (req.body && req.body.materials && req.body.materials.length > 0) {
        req.body.materials.forEach((object) => {
            object.poNumber = req.body.poNumber;
            object.poDate = req.body.poDate;
            object.revisionReference = req.body.revisionReference;
            object.revisionDate = req.body.revisionDate;
            object.plantCode = req.body.plantCode;
            object.organizationIntegrationId = req.body.organizationIntegrationId;
            object.billingAddress = req.body.billingAddress;
            object.deliveryAddress = req.body.deliveryAddress;
            object.remarks = req.body.remarks ? req.body.remarks : "";
        });
    }
    const data = await purchaseOrderService.createPurchaseOrder(req.body.materials);
    return { data };
};

/**
 * Method to get all plant codes
 * @param { object } req.body
 * @returns { object } data
 */
const getAllPlantCodes = async (req) => {
    const where = {};
    if (req.query && req.query.organizationIntegrationId) {
        where.organizationIntegrationId = req.query.organizationIntegrationId;
    }
    const data = await purchaseOrderService.getAllDataByColumn("plantCode", where);
    return { data };
};

/**
 * Method to get all purchase orders
 * @param { object } req.body
 * @returns { object } data
 */
const getAllPurchaseOrders = async (req) => {
    const where = {};
    if (req.query && req.query.organizationIntegrationId) {
        where.organizationIntegrationId = req.query.organizationIntegrationId;
    }
    if (req.query && req.query.plantCode) {
        where.plantCode = req.query.plantCode;
    }
    if (req.query && req.query.status) {
        where.status = req.query.status;
    }
    const data = await purchaseOrderService.getAllPurchaseOrders(where);
    if (data && data.count > 0) {
        const groupByPoNumber = data.rows.reduce((group, arr) => {
            const { poNumber } = arr;
            group[poNumber] = group[poNumber] ?? [];
            group[poNumber].push(arr);
            return group;
        }, {});
        const poDataArr = [];
        const poData = {
            poDataArr: poDataArr,
            count: 0
        };
        if (groupByPoNumber) {
            for (const value of Object.values(groupByPoNumber)) {
                const poMaterialArray = [];
                for (const obj of value) {
                    const poMaterialObj = {
                        materialIntegrationId: obj.materialIntegrationId,
                        longDescription: obj.longDescription,
                        quantity: obj.quantity,
                        unitPrice: obj.unitPrice,
                        priceUnit: obj.priceUnit,
                        totalPrice: obj.totalPrice,
                        tax: obj.tax,
                        deliverySchedule: obj.deliverySchedule
                    };
                    poMaterialArray.push(poMaterialObj);
                }
                const poBasicDataObj = {
                    poNumber: value[0].poNumber,
                    poDate: value[0].poDate,
                    revisionReference: value[0].revisionReference,
                    revisionDate: value[0].revisionDate,
                    plantCode: value[0].plantCode,
                    organizationIntegrationId: value[0].organizationIntegrationId,
                    billingAddress: value[0].billingAddress,
                    deliveryAddress: value[0].deliveryAddress,
                    remarks: value[0].remarks,
                    status: value[0].status,
                    materials: poMaterialArray
                };
                poDataArr.push(poBasicDataObj);
            }
            const count = Object.keys(groupByPoNumber).length;
            poData.poDataArr = poDataArr;
            poData.count = count;
        }
        return { poData };
    } else {
        throwError(statusCodes.BAD_REQUEST, statusMessages.NO_PURCHASE_ORDERS_FOUND);
    }
};

module.exports = {
    createPurchaseOrder,
    getAllPlantCodes,
    getAllPurchaseOrders
};

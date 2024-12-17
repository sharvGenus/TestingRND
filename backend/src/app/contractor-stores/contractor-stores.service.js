const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const ContractorStore = require("../../database/operation/contractor-stores");

const createContractorStores = async (contractorStoresDetails) => {
    try {
        const contractorStores = new ContractorStore();
        const data = await contractorStores.create(contractorStoresDetails);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_CONTRACTOR_STORE_FAILURE);
    }
};
const getContractorStoresByCondition = async (where) => {
    try {
        const contractorStores = new ContractorStore();
        const data = await contractorStores.findOne(where, undefined, true);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CONTRACTOR_STORE_FAILURE);
    }
};

const checkContractorStoresDataExist = async (where) => {
    try {
        const contractorStores = new ContractorStore();
        const count = await contractorStores.isAlreadyExists(where);
        return count;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CONTRACTOR_STORE_FAILURE);
        
    }
};

const updateContractorStores = async (contractorStoresDetails, where) => {
    try {
        const contractorStores = new ContractorStore();
        const data = await contractorStores.update(contractorStoresDetails, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CONTRACTOR_STORE_UPDATE_FAILURE);
    }
};

const getAllContractorStores = async () => {
    try {
        const contractorStores = new ContractorStore();
        const data = await contractorStores.findAndCountAll({}, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_CONTRACTOR_STORE_LIST_FAILURE);
    }
};

const deleteContractorStores = async (where) => {
    try {
        const contractorStores = new ContractorStore();
        const data = await contractorStores.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_CONTRACTOR_STORE_FAILURE);
    }
};

module.exports = {
    getContractorStoresByCondition,
    createContractorStores,
    updateContractorStores,
    getAllContractorStores,
    deleteContractorStores,
    checkContractorStoresDataExist
};

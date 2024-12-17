const { throwIf, throwIfNot } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const allMastersListService = require("./all-masters-list.service");

const staticRightsData = [
    {
        id: "stores",
        name: "Stores"
    },
    {
        id: "a8bbb41a-57d4-443d-ac6c-784dc1f0d1cb",
        name: "View Stores"
    },
    {
        id: "storesLocation",
        name: "Stores Location"
    },
    {
        id: "d4dc5b2c-8c9c-4bd9-93e3-f9f3d42f5cc7",
        name: "GAA & Network"
    },
    // {
    //     id: "d8715506-5f9b-42d9-b6cd-3a3784481174",
    //     name: "Mobile-Forms"
    // },
    {
        id: "7ac8a08a-c2e4-4661-af43-616460c76887",
        name: "Mobile-Forms"
    },
    {
        // This id is same as Form-responses that is present in all_masters_list
        id: "65b01aaf-46ab-468c-b6bd-4fa72a2f089a",
        name: "Web-Forms"
    },
    {
        // This id is same as Reports that is present in all_masters_list
        id: "8b682419-3d70-4c52-b229-c82b5559aec8",
        name: "Web-Reports"
    }
];

/**
 * Method to create all masters list
 * @param { object } req.body
 * @returns { object } data
 */
const createAllMastersList = async (req) => {
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ALL_MASTERS_LIST_DETAILS);
    const isAllMastersListExists = await allMastersListService.allMastersListAlreadyExists({ name: req.body.name });
    throwIf(isAllMastersListExists, statusCodes.DUPLICATE, statusMessages.ALL_MASTERS_LIST_ALREADY_EXIST);
    const data = await allMastersListService.createAllMastersList(req.body);
    return { data };
};

/**
 * Method to update all masters list
 * @param { object } req.body
 * @returns { object } data
 */
const updateAllMastersList = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ALL_MASTERS_LIST_ID_REQUIRED);
    throwIfNot(req.body, statusCodes.BAD_REQUEST, statusMessages.MISSING_ALL_MASTERS_LIST_DETAILS);
    const isAllMastersListExists = await allMastersListService.allMastersListAlreadyExists({ id: req.params.id });
    throwIfNot(isAllMastersListExists, statusCodes.DUPLICATE, statusMessages.ALL_MASTERS_LIST_NOT_EXIST);
    const data = await allMastersListService.updateAllMastersList(req.body, { id: req.params.id });
    return { data };
};

/**
 * Method to get all masters list details by id
 * @param { object } req.body
 * @returns { object } data
 */
const getAllMastersListDetails = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ALL_MASTERS_LIST_ID_REQUIRED);
    const data = await allMastersListService.getAllMastersListByCondition({ id: req.params.id });
    return { data };
};

/**
 * Method to get all all masters list
 * @param { object } req.body
 * @returns { object } data
 */
const getAllMastersList = async (req) => {
    const data = await allMastersListService.getAllMastersList();
    return { data };
};

/**
 * Method to delete all masters list by all masters list id
 * @param { object } req.body
 * @returns { object } data
 */
const deleteAllMastersList = async (req) => {
    throwIfNot(req.params.id, statusCodes.BAD_REQUEST, statusMessages.ALL_MASTERS_LIST_ID_REQUIRED);
    const data = await allMastersListService.deleteAllMastersList({ id: req.params.id });
    return { data };
};

const getRightsForDropdownData = async () => {
    const { rows } = await allMastersListService.getAllMastersList({ lovAccess: true }, ["id", "visibleName"], false);
    const transformedData = rows.map((item) => ({
        id: item.id,
        name: item.visibleName
    }));
    const data = transformedData.concat(staticRightsData);
    return { data };
};

module.exports = {
    createAllMastersList,
    updateAllMastersList,
    getAllMastersListDetails,
    deleteAllMastersList,
    getAllMastersList,
    getRightsForDropdownData
};

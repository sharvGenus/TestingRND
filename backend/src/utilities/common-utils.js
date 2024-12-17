/* eslint-disable no-plusplus */
const crypto = require("node:crypto");
const { validationResult } = require("express-validator");
const axios = require("axios");
// const excel = require("excel4node");
const { Op } = require("sequelize");
const { HTTP_UNPROCESSABLE_ENTITY } = require("../config/status-codes");
const { BaseError } = require("../services/error-class");
const logger = require("../logger/logger");

/**
 * This Function is used to return some random string of size(default is 10).
 *
 * @param {Number} size
 * @returns
 */
const generateRandomString = function (size = 10) {
    return crypto.randomBytes(size).toString("hex").slice(0, size);
};

/**
 * This Function is used to get the ip address from the request Object
 * @param {*} req
 * @returns
 */
const getIpAddress = function (req) {
    const ipaddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
    return ipaddress && ipaddress.split(",").length > 0
        ? ipaddress.split(",")[0]
        : ipaddress;
};

/**
 * Function to create a Unique array from an array
 * 
 * @param {Array} array - List of elements
 * @returns array - list of unique elements
 */
const getUniqueArray = function (array) {
    return [...new Set(array)];
};

/**
 * Function is used to convert plain text to base64
 *
 * @param {String} text
 * @returns string
 */
const textToBase64 = function (text = "") {
    return Buffer.from(text).toString("base64");
};

/**
 * Function is used to convert from base64 to plain text
 *
 * @param {String} base64Text
 * @returns string
 */
const base64ToText = function (base64Text = "") {
    return Buffer.from(base64Text, "base64").toString();
};
/**
 * Function is used to remove key-pair from an object
 * 
 * @param {Array} keys - An array of keys 
 * @param {Object} object - An object
 * @returns object - A filtered object of removed keys
 */
const omitKeyFromObject = (keys, object) => Object.fromEntries(
    Object.entries(object)
        .filter(([k]) => !keys.includes(k))
);

/**
 * Function to add a new key-pair in an object
 * @param {Object} keys - An object of key-value pairs to be added
 * @param {Object} object - An object to which values to be added
 * @returns object - A object withb added key-value pairs
 */
const extend = (existingData, newData) => Object.assign(existingData, newData);

/**
 * Function to find the different elements in 2 arrays
 * @param {Array} firstArray
 * @param {Array} secondArray
 * @returns array
 */
const arrayDifference = (array1, array2) => {
    const arrays = [array1, array2];
    return arrays.reduce((a, b) => a.filter((c) => !b.includes(c)));
};
/**
 * Function to find whether the given 2 arrays are equal
 * @param {Array} array1
 * @param {Array} array2  
 * @returns boolean
 */
const isEqualArray = (array1, array2) => {
    if (array1.length !== array2.length) return false;
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) return false;
    }
    return true;
};

/**
 * Function to get the past date as per the desired parameter
 * @param {Number/String} numericValue - day difference from current date to old date
 * @returns date
 */
const getOldDate = function (oldDate = 7) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - oldDate);
    return currentDate.setHours(0, 0, 0, 0);
};

/**
 * Function to get the past date as per the desired parameter
 * @param {Number/String} numericValue - password salt length
 * @returns the hash of salt
 */
function makePasswordSalt(length) {
    return crypto
        .randomBytes(length)
        .toString("hex") /* convert to hexadecimal format */
        .slice(0, length);/* return required number of characters */
}

/**
 * Function to get the past date as per the desired parameter
 * @param {String} searchItem 
* @param {Object} condition 
 * @param {String} searchColumn 
 * @returns Object
 */
const filterByTime = (searchItem, condition, searchColumn) => {
    const getTimeLimits = searchItem.split(" ");
    const lowerTimeLimit = new Date(parseInt(getTimeLimits[3]));
    const upperTimeLimit = new Date(parseInt(getTimeLimits[1]));
    if (lowerTimeLimit && upperTimeLimit) {
        if (searchColumn === "updatedAt") {
            condition.where[Op.or] = [{
                [Op.and]: [
                    { updatedAt: { [Op.gte]: lowerTimeLimit } },
                    { updatedAt: { [Op.lte]: upperTimeLimit } }]
            },
            {
                [Op.and]: [
                    { createdAt: { [Op.gte]: lowerTimeLimit } },
                    { createdAt: { [Op.lte]: upperTimeLimit } }
                ]
            }
            ];
        }
    }
    return condition;
};

/**
 * Function to handle Promises
 * @param {} promiseIns 
 * @returns Object
 */
const handlePromise = (promiseIns) => (promiseIns
    ? promiseIns
        .then((success) => [success, null])
        .catch((error) => [null, error])
    : [null, new Error(`Undefined promiseIns : ${promiseIns}`)]);

const handleResponse = (...args) => {
    const [_actionFn, req, res] = args;
    const errors = validationResult(req);
    /**
     * Finds the validation errors in this request and wraps them in an object withhandy functions
    */
    if (!errors.isEmpty()) {
        return res.status(HTTP_UNPROCESSABLE_ENTITY).send({
            code: "ERR_SYSTEM",
            return_code: 1025,
            errors: errors.array({ onlyFirstError: true })
        });
    }

    let time = Date.now();
    function logTimes(isProgressive) {
        return () => {
            console.log(req.url, Date.now() - time);
            if (!isProgressive) time = Date.now();
        };
    }

    return _actionFn(req, res, logTimes()).then((data) => {
        // don't send any response to client in case res has been already sent to the client inside the controller function
        if (data?.noResponsetoClient) return true;

        if (data && typeof data === "object" && Object.hasOwn(data, "buffer")) {
            return res.sendFileSuccess(data.buffer, data.contentType, data.filename);
        } else {
            return res.success(data);
        }
    }).catch((error) => {
        error.statusCode = error.statusCode || 500;
        // Log only if error is not intentionally thrown
        if (!(error instanceof BaseError)) {
            if (error.statusCode >= 500) {
                logger.error(error);
            } else {
                logger.warn(error.message);
            }
        }
        return res.error(error);
    });
};

const getRefererWithoutHost = async (request) => {
    const referrer = request.headers.referer || request.headers.referrer;
    const referrerURL = new URL(referrer);
    const referrerPath = referrerURL.pathname;
    const referrerPathWithoutHost = referrerPath.replace(referrerURL.origin, "");
    return referrerPathWithoutHost;
};

const getReferrerHostOnly = (request) => {
    console.log(request.get("host"));
    const referrer = request.headers.referer || request.headers.referrer;
    const parts = referrer.split("/");
    const baseUrl = parts.slice(0, 3).join("/");
    return baseUrl;
};

/**
 * This function is used for calling external APIs.
 * @param {*} requestOptions 
 * @returns {Object} 
 */
const callAxiosAPI = async (requestOptions) => {
    let [success, error] = await handlePromise(axios(requestOptions));
    success = success?.data || null;
    error = error?.response?.data || error?.data || null;
    return {
        success, error
    };
};

/**
 * This function is used for adding key value pair in the object.
 * @param {array} requestOptions 
 * @returns {array} 
 */
const addKeyValuePairToObject = (objArray, key, value) => objArray.map((obj) => ({ ...obj, [key]: value }));

const formatTimeStamp = (_date) => {
    try {
        const { day, month, year, hours, minutes } = processDate(_date);
        return `${day}-${month}-${year}, ${hours}:${minutes}`;
    } catch (error) {
        return _date;
    }
};

const formatDate = (_date) => {
    try {
        const { day, month, year } = processDate(_date);
        return `${day}-${month}-${year}`;
    } catch (error) {
        return _date;
    }
};

const processDate = (_date) => {

    const dateObj = new Date(_date);
  
    if (!_date || Number.isNaN(dateObj)) {
        throw new Error("Invalid Date");
    }
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    return { day, month, year, hours, minutes };
};

/**
 * This function is used to generate the unique string.
 * @returns {string} 
 */
const generateUniqueString = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let uniqueString = "";
  
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueString += characters.charAt(randomIndex);
    }
  
    return uniqueString;
};

/**
 * Function to add a pause for given time
 * @param {Number} timeout time in miliseconds
 * @returns {Promise}
 */
// eslint-disable-next-line no-promise-executor-return
const sleep = (timeout) => new Promise((resolve) => setTimeout(() => {
    resolve();
}, timeout));

// const exportToExcel = async (headers, data, response) => {
//     // create a new Excel workbook and add a worksheet
//     const wb = new excel.Workbook();
//     const ws = wb.addWorksheet();

//     // create a style for the header row
//     const headerStyle = wb.createStyle({
//         font: {
//             color: "#FFFFFF",
//             bold: true
//         },
//         fill: {
//             type: "pattern",
//             patternType: "solid",
//             bgColor: "#0073e6"
//         }
//     });

//     // initialize an array to store the maximum column widths
//     const columnWidths = new Array(headers.length).fill(0);

//     // write headers to the worksheet and update column widths
//     headers.forEach((header, index) => {
//         ws.cell(1, index + 1).string(header).style(headerStyle);
//         columnWidths[index] = Math.max(columnWidths[index], header.length);
//     });

//     // populate data rows and update column widths
//     data.forEach((rowData, rowIndex) => {
//         headers.forEach((header, columnIndex) => {
//             const cellValue = String(rowData[header] || "-N/A-"); // Handle missing or undefined data
//             ws.cell(rowIndex + 2, columnIndex + 1).string(cellValue);
//             columnWidths[columnIndex] = Math.max(columnWidths[columnIndex], cellValue.length);
//         });
//     });

//     // set the calculated column widths
//     columnWidths.forEach((width, index) => {
//         ws.column(index + 1).setWidth(width + 2);
//     });

//     // save the workbook to the specified file path
//     return wb.write("file.xlsx", response);
// };

// function isObject(value) {
//     const type = typeof value;
//     return value != null && (type === "object" || type === "function");
// }
  
// const getReccurssiveObjectKeys = (object, path) => {
//     if (!isObject(object)) {
//         return object;
//     }
//     path = path?.split(".");
//     const { length } = path;
  
//     let index = -1;
//     let nested = object;
//     while (nested != null && ++index < length) {
//         const key = path[index];
//         nested = nested[key];
//     }
//     return nested;
// };

const filterObjectsByKeys = (objects, keys) => objects.map((obj) => {
    const filteredObj = {};
    keys.forEach((key) => {
        if (Object.hasOwnProperty.call(obj, key)) {
            filteredObj[key] = obj[key];
        }
    });
    return filteredObj;
});
function getMappingKeysInArray(array, mapping) {
    const result = [];
  
    for (const key in mapping) {
        if (array.includes(mapping[key])) {
            result.push(key);
        }
    }
  
    return result;
}

const validateUUID = (...uuids) => {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    return uuids.every((uuid) => {
        if (Array.isArray(uuid)) {
            return uuid.every((id) => regex.test(id));
        } else {
            return regex.test(uuid) || !uuid;
        }
    });
};

function calculateOffsetAndLimit(queryObject) {
    const paginations = {};

    const pageNumber = parseInt(queryObject.pageNumber, 10);
    const rowPerPage = parseInt(queryObject.rowPerPage, 10);

    if (pageNumber > 0 && rowPerPage > 0) {
        paginations.offset = (pageNumber - 1) * rowPerPage;
    }

    if (rowPerPage > 0) {
        paginations.limit = rowPerPage;
    }

    return paginations;
}

function generatePaginationParams(queryObject) {
    const paginations = calculateOffsetAndLimit(queryObject);

    let paginationParams = "";
    if (paginations.limit !== undefined) {
        paginationParams += `LIMIT ${paginations.limit} `;
    }

    if (paginations.offset !== undefined) {
        paginationParams += `OFFSET ${paginations.offset}`;
    }

    return paginationParams.trim();
}

/**
 * Function to get the date in MMDDYYYY format
 * @param {Number} timestamp 
 * @returns {String} date in MMDDYYY format
 */
function getFormattedDate(timestamp = Date.now()) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based in JavaScript
    const year = date.getFullYear();

    // Combine the parts to form the desired format
    return `${month}${day}${year}`;
}

module.exports = {
    generateRandomString,
    getIpAddress,
    textToBase64,
    base64ToText,
    handlePromise,
    getUniqueArray,
    omitKeyFromObject,
    getRefererWithoutHost,
    getReferrerHostOnly,
    extend,
    arrayDifference,
    isEqualArray,
    getOldDate,
    makePasswordSalt,
    filterByTime,
    handleResponse,
    callAxiosAPI,
    addKeyValuePairToObject,
    formatTimeStamp,
    formatDate,
    generateUniqueString,
    sleep,
    filterObjectsByKeys,
    getMappingKeysInArray,
    generatePaginationParams,
    validateUUID,
    calculateOffsetAndLimit,
    getFormattedDate
    // exportToExcel,
    // getReccurssiveObjectKeys
};

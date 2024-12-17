/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
const { Op } = require("sequelize");
const { get } = require("express-http-context");
const DataBaseConnection = require("../database-connection.service");
const databaseSchema = require("../../config/database-schema");
const { throwError, throwIf } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const RedisDatabase = require("../../utilities/redisDatabase");

/**
 * Represents a database object with various properties and functionalities.
 * 
 * This class provides the methods for database create, update, delete, get count and others
 * 
 * created by               version                         date
 * Harish                   1.0.0                           26 May 2023
 * 
 * @class Base
 */
class Base extends DataBaseConnection {
    constructor(requestQuery) {
        super();
        this.requestQuery = requestQuery;
        this.logging = () => true;
        this.redisDb = new RedisDatabase();
        this.userData = get("requestUser");
    }

    /**
     * method to add databsae model into class local variable
     * @returns {undefined}
     */
    initialiseModel() {
        this.model = this.db[this.modelName];
        this.queryObject = this.getQueryFromRequest();
    }

    /**
     * Generate Uniform query object for paginations
     * @param {Object} queryObject Optional | object containing the paginations data
     * @returns {Object}
     */
    getQueryFromRequest(queryObject = this.requestQuery || get("qyeryObject")) {
        const isHistory = this.modelName.includes("_history") && Object.values(databaseSchema).includes(this.modelName.replace("_history", ""));
        this.whereClauseOverRide = { ...(!isHistory && { isActive: "1" }) };
        if (queryObject && Object.prototype.toString(queryObject) === "[object Object]" && Object.keys(queryObject).length > 0) {
            const paginations = {};
            if (queryObject.sort?.[0]) {
                paginations.order = [[this.db.sequelize.col(queryObject.sort[0]), queryObject.sort[1] || "DESC"]];
                paginations.sort = queryObject.sort;
            }
            if (+queryObject.pageNumber && +queryObject.pageNumber - 1 && +queryObject.rowPerPage) {
                paginations.offset = (queryObject.pageNumber - 1) * queryObject.rowPerPage;
            }
            if (+queryObject.rowPerPage) {
                paginations.limit = +queryObject.rowPerPage;
            }
            if (queryObject.listType && queryObject.listType === "0" && !isHistory) {
                this.whereClauseOverRide = { isActive: "0" };
            }
            if (queryObject.listType && queryObject.listType === "1" && !isHistory) {
                this.whereClauseOverRide = { isActive: "1" };
            }
            if (queryObject.listType && queryObject.listType === "2" && !isHistory) {
                this.whereClauseOverRide = {};
            }
            return paginations;
        }
        return {};
    }

    testWhereClause(where, allowBlankCondition = false) {
        if (where && Object.prototype.toString.call(where) === "[object Object]"
         && (Object.keys(where)?.length || Object.getOwnPropertySymbols(where)?.length || 0) > (allowBlankCondition ? -1 : 0)) {
            return true;
        }
        throwError("Invalid where condition");
    }

    /**
     * Returns a database transaction to use in database operations
     * @param {Object} transaction Optional
     * @param {String} isolationLevel Optional
     * @returns {Promise<Object>}
     */
    getNewTransactionInstance(transaction, isolationLevel) {
        return this.db.sequelize.transaction({
            autocommit: false,
            transaction,
            isolationLevel
        });
    }

    /**
     * return array with only needed fields
     * @param {Array} attributes 
     * @returns 
     */
    getWhitelistedFields(attributes) {
        const isArray = Object.prototype.toString.call(attributes) === "[object Array]";
        if (isArray) {
            const allFieldsArr = Object.entries(this.fields);
            const filtered = allFieldsArr.filter((x) => (x ? x[1].slice(0, 2) !== "__" : x));
            return attributes.filter((x) => filtered.some((y) => y[0] === x));
        }
        return attributes;
    }
    
    /**
     * Function to get an filtered object of overriden queries
     * @returns filter object of general overriden querys as per model columns
     */
    getOverRidesQueries() {
        const overRides = Object.entries(this.whereClauseOverRide);
        return Object.fromEntries(overRides.filter((x) => x[0] && this.fields[x[0]]));
    }

    /**
     * Method to find data (paginated data if required) and count all records in a table
     * @param {Object} whereCondition 
     * @param {Array} attributes 
     * @param {Boolean} isRelated 
     * @param {Boolean} distinct 
     * @param {Object} paginated 
     * @param {Boolean} raw 
     * @param {Boolean} paranoid
     * @returns {Promise<Object>}
     */
    async findAndCountAll(whereCondition, attributes = this.fieldsList, isRelated = false, distinct = false, paginated = this.queryObject, raw = false, respectBlacklist = true, paranoid = false) {
        const [rows, count] = await Promise.all([
            this.model.findAll({
                logging: this.logging,
                attributes: [...respectBlacklist ? this.getWhitelistedFields(attributes) : attributes],
                where: { ...this.getOverRidesQueries(), ...whereCondition },
                distinct,
                ...raw && { raw, nest: true },
                ...isRelated && { include: this.relations },
                ...paginated && Object.keys(paginated || {}).length > 0 && { ...paginated },
                ...this.getOverRidesQueries().isActive !== "1" && { paranoid: paranoid || false }
            }),
            this.model.count({
                logging: this.logging,
                where: { ...this.getOverRidesQueries(), ...whereCondition },
                distinct,
                ...isRelated && { include: this.relations },
                ...this.getOverRidesQueries().isActive !== "1" && { paranoid: paranoid || false }
            })
        ]);
        return { rows, count };
    }

    /**
     * Method to fetch records as per given condition from database tables
     * @param {Object} whereCondition 
     * @param {Array} attributes 
     * @param {Boolean} isRelated 
     * @param {Boolean} distinct 
     * @param {Object} paginated 
     * @param {Boolean} raw
     * @param {Boolean} paranoid
     * @returns {Promise<Array>}
     */
    async findAll(whereCondition, attributes = this.fieldsList, isRelated = false, distinct = false, paginated = this.queryObject, raw = false, respectBlacklist = true, paranoid = false) {
        return this.model.findAll({
            logging: this.logging,
            attributes: [...respectBlacklist ? this.getWhitelistedFields(attributes) : attributes],
            where: { ...this.getOverRidesQueries(), ...whereCondition },
            distinct,
            ...raw && { raw, nest: true },
            ...isRelated && { include: this.relations },
            ...this.getOverRidesQueries().isActive !== "1" && { paranoid: paranoid || false },
            ...paginated && Object.keys(paginated || {}).length > 0 && { ...paginated }
        });
    }

    /**
     * Method to find the most recent record from database
     * @param {Object} whereCondition 
     * @param {Array} attributes 
     * @param {Boolean} isRelated 
     * @param {Object} paginated
     * @param {Boolean} raw 
     * @param {Boolean} paranoid
     * @returns {Promise<Object>}
     */
    async findOne(whereCondition, attributes = this.fieldsList, isRelated = false, paginated = {}, raw = false, respectBlacklist = true, paranoid = false) {
        return this.model.findOne({
            logging: this.logging,
            attributes: [...respectBlacklist ? this.getWhitelistedFields(attributes) : attributes],
            where: { ...whereCondition },
            ...raw && { raw, nest: true },
            ...isRelated && { include: this.relations },
            ...paginated && Object.keys(paginated || {}).length > 0 && { ...paginated },
            paranoid
        });
    }

    /**
     * Method to create new records in database
     * @param {Object} payLoad 
     * @param {Object} transaction 
     * @returns {Promise<Object>}
     */
    async create(payLoad, transaction) {
        if (!payLoad.createdBy && this.fields.createdBy && this.userData?.userId) {
            payLoad.createdBy = this.userData.userId;
        }
        if (!payLoad.updatedBy && this.fields.updatedBy && this.userData?.userId) {
            payLoad.updatedBy = this.userData.userId;
        }
        return this.model.create(payLoad, { transaction, individualHooks: true, returning: true, logging: this.logging });
    }

    /**
     * Method to create multiple records in database
     * @param {Array <Object>} payLoadArray 
     * @param {Object} transaction 
     * @returns {Promise<Array>}
     */
    async bulkCreate(payLoadArray, transaction) {
        payLoadArray.forEach((payLoad) => {
            if (!payLoad.createdBy && this.fields.createdBy && this.userData?.userId) {
                payLoad.createdBy = this.userData.userId;
            }
            if (!payLoad.updatedBy && this.fields.updatedBy && this.userData?.userId) {
                payLoad.updatedBy = this.userData.userId;
            }
        });
        
        const duplicatedPayload = payLoadArray?.flatMap(({ userId, ...rest }) => {
            if (Array.isArray(userId)) {
                return userId.map((id) => ({ userId: id, ...rest }));
            } else {
                return [{ userId, ...rest }];
            }
        });
        
        // const duplicatedPayload = payLoadArray.flatMap(({ userId, ...rest }) => userId.map((id) => ({ userId: id, ...rest })));
        const result = await this.model.bulkCreate(duplicatedPayload, {
            logging: this.logging,
            ignoreDuplicates: true,
            individualHooks: true,
            transaction
        });
        return result;
    }

    /**
     * Method to update record(s) in database
     * @param {Object} payLoad 
     * @param {Object} where 
     * @param {Object} transaction
     * @param {Boolean} paranoid 
     * @returns {Promise <Object>}
     */
    async update(payLoad, where = {}, transaction = null, paranoid = false) {
        this.testWhereClause(where);
        if (this.fields.updatedBy && this.userData?.userId) {
            payLoad.updatedBy = this.userData.userId;
        }
        return this.model.update(payLoad, { where, transaction, individualHooks: true, returning: true, paranoid, logging: this.logging });
    }

    /**
     * Method to delete any record from database, deleted return number of rows
     * @param {Object} whereClause 
     * @param {Object} transaction 
     * @returns {Promise<Number>}
     */
    async delete(whereClause, transaction, deleteData = true) {
        this.testWhereClause(whereClause);
        if (whereClause.id && typeof whereClause.id === "string" && !Array.isArray(whereClause.id)) {
            const data = await this.db.sequelize.query(`select check_for_associations('public', '${this.modelName}', '${whereClause.id}')`);
            throwIf(data[0][0].check_for_associations, statusCodes.BAD_REQUEST, data[0][0].check_for_associations);
        }
        if (this.fields.isActive && deleteData) {
            return this.update({ isActive: "0" }, whereClause, transaction);
        }
        return this.forceDelete(whereClause, transaction, true);
    }

    /**
     * Method to force delete records from database
     * @param {Object} whereClause 
     * @param {Object} transaction
     * @param {Boolean} paranoid
     * @param {Boolean} force 
     * @returns {Promise}
     */
    async forceDelete(whereClause, transaction, force = true) {
        if (whereClause.id && typeof whereClause.id === "string" && !Array.isArray(whereClause.id)) {
            const data = await this.db.sequelize.query(`select check_for_associations('public', '${this.modelName}', '${whereClause.id}')`);
            throwIf(data[0][0].check_for_associations, statusCodes.BAD_REQUEST, data[0][0].check_for_associations);
        }
        this.testWhereClause(whereClause);
        return this.model.destroy({
            where: whereClause,
            transaction,
            individualHooks: true,
            returning: true,
            force,
            logging: this.logging
        });
    }

    /**
     * Method to truncate a table from database
     * @param {Object} transaction 
     * @returns {Promise}
     */
    async truncate(transaction) {
        return this.model.truncate({ logging: this.logging, transaction, restartIdentity: true });
    }

    /**
     * Method to check whether a record exits in database with given parameters
     * @param {Object} whereCondition 
     * @param {Boolean} paranoid
     * @returns {Promise<Boolean>}
     */
    async isAlreadyExists(whereCondition, paranoid = false) {
        this.testWhereClause(whereCondition);
        const result = await this.model.count({
            logging: this.logging,
            where: { ...whereCondition },
            paranoid
        });
        return result > 0;
    }

    /**
     * Method to check whether a record exits in database with given parameters
     * @param {Object} whereCondition
     * @param {Boolean} paranoid
     * @returns {Promise<Boolean>}
     */
    async isNotExists(whereCondition, paranoid = false) {
        this.testWhereClause(whereCondition);
        const result = await this.model.count({
            logging: this.logging,
            where: { ...whereCondition },
            paranoid
        });
        return result === 0;
    }

    /**
     * Method to create a new record in database if records doesn't exists if it exists then update the same
     * @param {Object} where 
     * @param {Object} newItem 
     * @param {Object} transaction
     * @returns {Peomise<Object>}
     */
    async createOrUpdate(where, newItem, transaction = null) {
        this.testWhereClause(where);
        // First try to find the record
        const notFoundItem = await this.isNotExists(where);
        if (notFoundItem) {
            // Item not found, create a new one
            const item = await this.create(newItem, transaction);
            return { item: item, created: true };
        } else {
            // Found an item, update it
            const updated = await this.update(newItem, where, transaction);
            return { item: updated, created: false };
        }
    }

    /**
     * Method to cout the existing records in database
     * @param {Object} whereClause 
     * @param {Boolean} paranoid
     * @returns {Promise<Number>}
     */
    async count(where, paranoid = false) {
        this.testWhereClause(where, true);
        return this.model.count({
            logging: this.logging,
            where,
            paranoid
        });
    }

    /**
     * Method to return count with group by cluase of records in any table
     * @param {Object} groupColumn 
     * @param {Object} where 
     * @param {Date} time1Arg 
     * @param {Date} time2Arg 
     * @param {Boolean} paranoid
     * @returns {Promise<Object>}
     */
    async countWithGroup(groupColumn, where = {}, time1Arg = null, time2Arg = null, paranoid = false) {
        let time1 = time1Arg;
        let time2 = time2Arg;
        if (time1 && time2) {
            time1 = new Date(+time1);
            time2 = new Date(+time2);
            where.createdAt = {
                [Op.between]: [time1, time2]
            };
        }

        if (time1 && !time2) {
            time1 = new Date(+time1);
            where.createdAt = {
                [Op.gte]: time1
            };
        }

        const data = await this.model.findAll({
            attributes: [groupColumn, [this.db.sequelize.fn("COUNT", "*"), "count"]],
            group: [groupColumn],
            where: { ...this.getOverRidesQueries(), ...where },
            raw: true,
            logging: this.logging,
            ...this.getOverRidesQueries().isActive !== "1" && { paranoid: paranoid || false }
        });

        const countObj = {};
        data.forEach((value) => {
            countObj[value[groupColumn]] = value.count;
        });

        return countObj;
    }

    generateRawQuery(conditions = {}) {
        const generateQuery = this.db.sequelize.queryInterface.queryGenerator
            .selectQuery(this.modelName, conditions)
            .slice(0, -1).replace(/null\./gi, `${this.name}.`);
        return generateQuery;
    }
}

module.exports.Base = Base;

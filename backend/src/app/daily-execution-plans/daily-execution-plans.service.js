const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");
const statusMessages = require("../../config/status-message");
const DailyExecutionPlans = require("../../database/operation/daily-execution-plans");
const DailyExecutionPlansHistory = require("../../database/operation/daily-execution-plans-history");

const isDailyExecutionPlanExists = async (where) => {
    try {
        const dailyExecutionPlans = new DailyExecutionPlans();
        const data = await dailyExecutionPlans.isAlreadyExists(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DAILY_EXECUTION_PLAN_FAILURE, error);
    }
};

const createDailyExecutionPlan = async (body) => {
    try {
        const dailyExecutionPlans = new DailyExecutionPlans();
        const data = await dailyExecutionPlans.create(body);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.CREATE_DAILY_EXECUTION_PLAN_FAILURE, error);
    }
};

const updateDailyExecutionPlan = async (body, where) => {
    try {
        const dailyExecutionPlans = new DailyExecutionPlans();
        const data = await dailyExecutionPlans.update(body, where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DAILY_EXECUTION_PLAN_UPDATE_FAILURE, error);
    }
};

const getDailyExecutionPlanList = async (where) => {
    try {
        const dailyExecutionPlans = new DailyExecutionPlans();
        dailyExecutionPlans.queryObject.order = [["year", "ASC"], ["month", "ASC"]];
        const data = await dailyExecutionPlans.findAndCountAll(where, undefined, true, true, undefined, false);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DAILY_EXECUTION_PLAN_FAILURE, error);
    }
};

const deleteDailyExecutionPlan = async (where) => {
    try {
        const dailyExecutionPlans = new DailyExecutionPlans();
        const data = await dailyExecutionPlans.delete(where);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.DELETE_DAILY_EXECUTION_PLAN_FAILURE, error);
    }
};

const getDailyExecutionPlanHistory = async (where) => {
    try {
        const dailyExecutionPlansHistory = new DailyExecutionPlansHistory();
        const data = await dailyExecutionPlansHistory.findAndCountAll(where, undefined, true, true, undefined);
        return data;
    } catch (error) {
        throwError(statusCodes.INTERNAL_ERROR, statusMessages.FETCH_DAILY_EXECUTION_PLAN_HISTORY_FAILURE, error);
    }
};

module.exports = {
    isDailyExecutionPlanExists,
    createDailyExecutionPlan,
    getDailyExecutionPlanList,
    updateDailyExecutionPlan,
    deleteDailyExecutionPlan,
    getDailyExecutionPlanHistory
};

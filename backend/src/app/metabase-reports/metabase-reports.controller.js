const statusCodes = require("../../config/status-codes");
const statusMessage = require("../../config/status-message");
const { throwIfNot } = require("../../services/throw-error-class");
const metabaseReportsService = require("./metabase-reports.service");

const fetchDashboard = async (req) => {
    try {
        return metabaseReportsService.fetchDashboard(req);
    } catch (error) {
        console.log(error, "error");
    }
};

const fetchFormReport = async (req) => {
    const { formId, mode, pageNumber, rowPerPage, gaaLevelFilter, countOnly, isTemp } = req.query;
    
    const paginations = {};
    if (+pageNumber && +pageNumber - 1 && +rowPerPage) {
        paginations.offset = (pageNumber - 1) * rowPerPage;
    }
    if (+rowPerPage) {
        paginations.limit = +rowPerPage;
    }

    const data = await metabaseReportsService.getReportData(formId, mode, req.user, paginations, gaaLevelFilter, countOnly === "1", isTemp, undefined, true);
    return { data };
};

const getGaaHierarchiesReport = async (req) => {
    const queryObject = req.query;
    const { projectId } = req.params;

    throwIfNot(projectId, statusCodes.BAD_REQUEST, statusMessage.PROJECT_ID_NOT_FOUND);

    const paginations = {};
    if (+queryObject.pageNumber && +queryObject.pageNumber - 1 && +queryObject.rowPerPage) {
        paginations.offset = (queryObject.pageNumber - 1) * queryObject.rowPerPage;
    }
    if (+queryObject.rowPerPage) {
        paginations.limit = +queryObject.rowPerPage;
    }

    const data = await metabaseReportsService.getGaaHierarchiesReport(projectId, paginations);
    return { data };
};

const supervisorMaterialReport = async (req) => {
    const { type } = req.query;
    let data;
    if (type === "supervisor") {
        data = await metabaseReportsService.supervisorMaterialReport(req.query);
    } else if (type === "installer") {
        data = await metabaseReportsService.installerMaterialReport(req.query);
    }
    return { data };
};

const getStockLedgerInstallerList = async (req) => {
    const { projectId } = req.query;
    const data = await metabaseReportsService.getStockLedgerInstallerList(projectId);
    return { data };
};

const getSiteExceptionReport = async (req) => {
    const data = await metabaseReportsService.getSiteExceptionReport();
    return { data };
};

const getAreaWiseProductivity = async (req) => {
    const data = await metabaseReportsService.getAreaWiseProductivity(req);
    return { data };
};

module.exports = {
    getAreaWiseProductivity,
    fetchDashboard,
    fetchFormReport,
    getGaaHierarchiesReport,
    supervisorMaterialReport,
    getStockLedgerInstallerList,
    getSiteExceptionReport
};

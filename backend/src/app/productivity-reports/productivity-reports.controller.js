const { getUserWiseReport } = require("./productivity-reports.service");

const getUserWiseProductivityReport = async (req) => {
    const report = await getUserWiseReport(req);
    return report;
};

module.exports = {
    getUserWiseProductivityReport
};

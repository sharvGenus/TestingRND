const logger = require("../logger/logger");

module.exports = (_req, _res, _next) => {
    let time = Date.now();
    _res.on("finish", () => {
        time = Date.now() - time;
        const clientIp = _req.headers["x-forwarded-for"] || _req.headers["X-Real-IP"] || _req.ip || _req.connection.remoteAddress;
        logger.info(`Resposne: [${clientIp}] | [${_req.method}] | [${_req.url}] | [${_res.statusCode}] | [${time}ms]`);
    });
    _next();
};
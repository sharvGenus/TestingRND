const { BaseError } = require("../services/error-class");
const logger = require("../logger/logger");

const baseError = new BaseError();

module.exports = (_req, _res, _next) => {
    let requestSize = 0;
    _req.on("data", (chunk) => {
        requestSize += chunk.length;
    });

    // this can be used for return success response
    _res.success = async (data) => _res.status(200).send({ status: "SUCCESS", code: 1000, ...data });

    // this can be used to send a file as the success response
    _res.sendFileSuccess = async (data, contentType = "application/octet-stream", filename = `file_${Date.now()}.bin`) => {
        _res.setHeader("Content-Type", contentType);
        _res.setHeader("Content-Disposition", `inline; filename=${filename}`);
        _res.status(200).send(data);
    };

    // this can we used for send error or bad request
    _res.error = async (_error) => {
        logger.error(_error);
        const errors = (_error.errors || []).map((err) => ({
            message: err.message,
            type: err.type,
            path: err.path,
            value: err.value
        }));
        const message = _error.message || baseError.message;
        const error = {
            errors,
            message,
            code: _error.code || baseError.code,
            return_code: _error.returnCode || baseError.returnCode
        };
        return _res.status(_error.statusCode || 400).json(error).end();
    };

    // this can we used for send the cusstom response
    _res.customResponse = async (data) => {
        const { response, statusCode } = data;
        const result = {
            ...response,
            code: statusCode == 200 ? "SUCCESS" : baseError.code,
            return_code: statusCode == 200 ? 1000 : 1025
        };
        return _res.status(statusCode).send(result);
    };
    _req.on("end", () => {
        const clientIp = _req.headers["x-forwarded-for"] || _req.headers["X-Real-IP"] || _req.ip || _req.connection.remoteAddress;
        logger.info(
            `Request: [${clientIp}] | [${_req.method}] | [${_req.url}] | [${requestSize}]`
        );
    });

    _next();
};

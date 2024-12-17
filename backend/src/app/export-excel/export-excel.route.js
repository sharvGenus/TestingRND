const router = require("express").Router();
const { set } = require("express-http-context");
const ensureAuthentications = require("../../middlewares/verify-user-token.middleware");
const exportExcel = require("./export-excel.controller");

const middleware = (req, res, next) => {
    set("qyeryObject", req.query || {});
    next();
};

router.post("/export-excel", ensureAuthentications, middleware, exportExcel.exportExcel);

module.exports = router;

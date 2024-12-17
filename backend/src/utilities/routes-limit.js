const express = require("express");

/**
 * Increase payload size limits for specific routes
 * @param { object } app
 */
const increaseLimitForRoutes = (app) => {
    app.use("/api/v1/organization/create", express.json({ limit: "50mb" }));
    app.use("/api/v1/organization/update/*", express.json({ limit: "50mb" }));
    app.use("/api/v1/organization-store/create", express.json({ limit: "50mb" }));
    app.use("/api/v1/organization-store/update/*", express.json({ limit: "50mb" }));
    app.use("/api/v1/organization-store-location/create", express.json({ limit: "50mb" }));
    app.use("/api/v1/organization-store-location/update/*", express.json({ limit: "50mb" }));
    app.use("/api/v1/project/create", express.json({ limit: "50mb" }));
    app.use("/api/v1/project/update/*", express.json({ limit: "50mb" }));
    app.use("/api/v1/material/create", express.json({ limit: "50mb" }));
    app.use("/api/v1/material/update/*", express.json({ limit: "50mb" }));

    app.use("/api/v1/stock-ledger/create", express.json({ limit: "70mb" }));
    app.use("/api/v1/min-transaction/create", express.json({ limit: "20mb" }));
    app.use("/api/v1/cti-transaction/create", express.json({ limit: "20mb" }));
    app.use("/api/v1/iti-transaction/create", express.json({ limit: "20mb" }));
    app.use("/api/v1/sto-transaction/create", express.json({ limit: "70mb" }));
    app.use("/api/v1/sto-grn-transaction/create", express.json({ limit: "20mb" }));
    app.use("/api/v1/stc-transaction/create", express.json({ limit: "20mb" }));
    app.use("/api/v1/ptp-transaction/create", express.json({ limit: "20mb" }));
    app.use("/api/v1/ptp-grn-transaction/create", express.json({ limit: "20mb" }));
    app.use("/api/v1/sltsl-transaction/create", express.json({ limit: "20mb" }));
    app.use("/api/v1/mrn-transaction/create", express.json({ limit: "20mb" }));
    app.use("/api/v1/returnmrn-transaction/create", express.json({ limit: "20mb" }));
    app.use("/api/v1/serial-number-exists", express.json({ limit: "20mb" }));
    app.use("/api/v1/installed-serial-number", express.json({ limit: "20mb" }));
    app.use("/api/v1/installation-check", express.json({ limit: "20mb" }));
    app.use("/api/v1/consumption-transaction/create", express.json({ limit: "20mb" }));

    app.use("/api/v1/cancel-min-transaction/create", express.json({ limit: "40mb" }));
    app.use("/api/v1/cancel-ptp-transaction/create", express.json({ limit: "40mb" }));
    app.use("/api/v1/cancel-ltl-transaction/create", express.json({ limit: "40mb" }));
    app.use("/api/v1/cancel-stc-transaction/create", express.json({ limit: "40mb" }));
    app.use("/api/v1/cancel-sto-transaction/create", express.json({ limit: "20mb" }));
    app.use("/api/v1/cancel-sto-grn-transaction/create", express.json({ limit: "40mb" }));
    app.use("/api/v1/cancel-mrn-transaction/create", express.json({ limit: "20mb" }));
    app.use("/api/v1/cancel-returnmrn-transaction/create", express.json({ limit: "40mb" }));

    app.use("/api/v1/form/create", express.json({ limit: "50mb" }));
    app.use("/api/v1/form/update", express.json({ limit: "50mb" }));
    app.use("/api/v1/govern-user-rows", express.json({ limit: "50mb" }));
    app.use("/api/v1/forms/ocr-reader", express.json({ limit: "50mb" }));

    app.use("/api/v1/user/update", express.json({ limit: "50mb" }));
    app.use("/api/v1/user/create", express.json({ limit: "50mb" }));

    app.use("/api/v1/ticket/create", express.json({ limit: "20mb" }));
    app.use("/api/v1/ticket/update", express.json({ limit: "20mb" }));

    app.use("/api/v1/project-scope-extension/create", express.json({ limit: "50mb" }));
    app.use("/api/v1/project-scope-extension/update", express.json({ limit: "50mb" }));

    app.use("/api/v1/devolution-form-data", express.json({ limit: "50mb" }));
    app.use("/api/v1/devolution/create", express.json({ limit: "50mb" }));
    app.use("/api/v1/devolution/update", express.json({ limit: "50mb" }));
    app.use("/api/v1/devolution-approve-reject", express.json({ limit: "50mb" }));
};

module.exports = {
    increaseLimitForRoutes
};

/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require("fs");
const path = require("path");

const loadRoutesAndMiddleware = function (app, apiVersion = "v1") {
    const modulesPath = path.join(__dirname, "../app", apiVersion).replace("v1", "");
    const modules = fs.readdirSync(modulesPath);
    modules.forEach((folderName) => {
        const preFix = `/api/${apiVersion}`;
        if (folderName === "v2") {
            return loadRoutesAndMiddleware(app, folderName);
        }
        const routeFileName = path.join(modulesPath, folderName, `${folderName}.route.js`);
        if (fs.existsSync(routeFileName)) {
            app.use(preFix, require(routeFileName));
        }
        
    });
};

module.exports = {
    loadRoutesAndMiddleware
};
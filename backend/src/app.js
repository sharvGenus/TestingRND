/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");

const cors = require("cors");
const path = require("node:path");
const fs = require("node:fs");
const bodyParser = require("body-parser");
const compression = require("compression");
const fileUpload = require("express-fileupload");
const { middleware, set } = require("express-http-context");
const cookieParser = require("cookie-parser");
const { loadRoutesAndMiddleware } = require("./utilities/server-utill");
const swaggerAPIDoc = require("./swagger");
const { increaseLimitForRoutes } = require("./utilities/routes-limit");
const statusCodes = require("./config/status-codes");
const statusMessage = require("./config/status-message");
const { getFormattedDate } = require("./utilities/common-utils");

const app = express();

app.use((req, res, next) => {
    res.setTimeout(300000); // 5 minutes
    next();
});

increaseLimitForRoutes(app);

// Load API Logger Middleware
app.use(middleware);
app.use(cors({
    origin: process.env.APP_HOST || "*",
    methods: "GET,PUT,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    exposedHeaders: ["Content-Disposition", "FileLength"]
}));

app.get("*", (req, res, next) => {
    set("qyeryObject", req.query || {});
    next();
});
app.use(require("./middlewares/api-logger.middleware"));
app.use(require("./middlewares/response-handler.middleware"));

app.use(fileUpload());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(require("./middlewares/cors"));
app.use(require("./middlewares/helmet"));

// Loadding Swagger API Doc
swaggerAPIDoc(app);

app.get(`/${global.formSubissionsUploadFolderNew}/*`, (req, res) => {
    const filePath = path.join(global.upploadFolder, req.path.replaceAll("%20", " "));
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    } else {
        res.status(400).send({ message: "Bad Request" });
    }
});

// /form-submissions-uploads/bill_photo_1714647533899_rn_image_picker_lib_temp_f7a03d96-9a7f-46c7-a7e7-373f9d3c590e.jpg
app.get(`/${global.formSubissionsUploadFolderName}/*`, (req, res) => {
    let filePath = path.join(global.upploadFolder, req.path);
    if (process.env.USE_NEW_UPLOAD_DIR === "true") {
        const pathArr = req.path.split("/");
        const fileName = pathArr.at(-1);
        const fileNameArr = fileName.split("_");
        let creationDate = null;
        let i = 0;
        while (i < fileNameArr.length) {
            const elem = fileNameArr[i];
            if (!Number.isNaN(+elem) && new Date(+elem).toString() !== "Invalid Date") {
                creationDate = elem;
                break;
            }
            i += 1;
        }
        if (creationDate) {
            const folder = getFormattedDate(+creationDate);
            filePath = path.join(global.upploadFolder, global.formSubissionsUploadFolderNew, folder, fileName);
            if (fs.existsSync(filePath)) {
                return res.sendFile(filePath);
            }
        }
        return res.status(400).send({ message: "Bad Request" });
    }
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }
    return res.status(400).send({ message: "Bad Request" });
});

app.get(`/${global.helpdeskTicketsUploadFolderName}/*`, (req, res) => {
    const filePath = path.join(global.upploadFolder, "Genus/WFM", req.path);
    console.log({ filePath });
    if (fs.existsSync(filePath)) {
        console.log(filePath);
        return res.sendFile(filePath);
    } else {
        res.status(statusCodes.BAD_REQUEST).send({ message: statusMessage.BAD_REQUEST });
    }
});

app.get(`/${global.projectLogo}`, (req, res) => {
    // This logic is written as we wont have information about the image extension.
    // This can be changed based on any better way.
    try {
        const { logoType } = req.query;
        const folderPath = path.join(global.upploadFolder, "Genus/WFM", global.projectLogo);
        const files = fs.readdirSync(folderPath);
        const [fileName] = files.filter((name) => name.includes(logoType));
        const finalPath = path.join(global.upploadFolder, "Genus/WFM", global.projectLogo, fileName);
        
        return res.sendFile(finalPath);
    } catch (err) {
        res.status(statusCodes.BAD_REQUEST).send({ message: statusMessage.BAD_REQUEST });
    }
});

app.use(express.static(path.join(process.cwd(), "../frontend/build")));

// load routes and controllers files
loadRoutesAndMiddleware(app);

app.get(["index.html", "/*"], (req, res) => {
    const indexFilePath = process.env.INDEX_FILE_PATH || path.join(process.cwd(), "../frontend/build/index.html");
    res.sendFile(indexFilePath);
});

module.exports = app;

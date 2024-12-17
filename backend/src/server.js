const http = require("http");
const https = require("https");
const fs = require("fs");
const EventEmitter = require("events");
const path = require("path");
const { WebSocketServer } = require("ws");
const { generateSelfSignedSSL, getSSLConfig } = require("./ssl/ssl.service");
const DataBaseConnection = require("./database/database-connection.service");
const subscriber = require("./utilities/subscriber");
const { createClient } = require("./utilities/redisClient");

// const { task } = require("./cron/inactive-users");

global.myEmitter = new EventEmitter();

const { HTTPS_PORT, HTTP_PORT } = process.env;
global.rootDir = path.resolve();
global.upploadFolder = path.resolve("public");
global.exportedFilesDirectory = path.resolve("exportedFiles");
global.formSubissionsUploadFolderName = "form-submissions-uploads";
global.formSubissionsUploadFolderNew = "fc-uploads";
global.helpdeskTicketsUploadFolderName = "helpdesk-tickets-uploads";
global.masterProject = "Masters/Project";
global.projectLogo = "project-logo";

const wssMessage = {
    PING: ({ connection }) => connection.send("PONG"),
    [global.eventNames.dataImportStatusCheck]: ({ connection }) => connection.send(
        JSON.stringify({
            type: "statusCheck",
            data: global.dataImportStatus
        })
    ),
    received: ({ webSocketId }) => process.send({
        eventType: "packet-received",
        id: webSocketId,
        pid: process.pid
    })
};

const startServer = async () => {

    // Create PostgreSQL database connection and Redis pub/sub
    await Promise.all([
        DataBaseConnection.createDatabaseConnection(),
        subscriber(),
        createClient()
    ]);

    // eslint-disable-next-line global-require
    const app = require("./app");
    let secureServer = null;
    if (process.env.DISABLED_HTTPS_SERVER !== "true") {
        if (!fs.existsSync(path.join(__dirname, "ssl/keys/localhost.key"))) {
            await generateSelfSignedSSL();
        }
        const sslConfig = getSSLConfig();
        secureServer = createHttpsServer(app, sslConfig);
        secureServer.listen(HTTPS_PORT, "0.0.0.0", function () {
            console.log(`Secure Server is listening on port ${HTTPS_PORT}`);
            // Redirect from http port 80 to https
            createHttpServer();
        });
        // task();
    } else {
        secureServer = http.createServer(app);
        secureServer.listen(HTTP_PORT, "0.0.0.0", function () {
            console.log(`Server is listening on port ${HTTP_PORT}`);
        });
        // task();
    }

    global.webSocket = {};
    const wss = new WebSocketServer({ noServer: true });

    secureServer.on("upgrade", function (request, socket, head) {
        const reqUrlArr = request.url.split("/");
        const connectionType = reqUrlArr && reqUrlArr.length > 1 ? reqUrlArr[1] : null;
        if (connectionType !== "socket.io") {
            wss.handleUpgrade(request, socket, head, function (ws) {
                wss.emit("connection", ws, request);
            });
        }
    });
    wss.on("connection", (connection, req) => {
        console.log("WebSocket connection established");
        const webSocketId = req.url.split("/")[1];
        global.webSocket[webSocketId] = connection;
        try {
            connection.on("ping", () => {
                connection.send("PONG");
            });
        
            connection.on("message", (message) => {
                if (Object.prototype.hasOwnProperty.call(wssMessage, message)) {
                    wssMessage[message].call(this, { connection, webSocketId });
                }
            });
        
            connection.on("close", () => {
                console.log("Connection closed");
                if (global.webSocket[webSocketId]) {
                    delete global.webSocket[webSocketId];
                }
            });
            connection.on("error", (error) => {
                console.log("> genus-wfm | [server.js] | #83 | error | ", error);
                connection.close();
            });
        } catch (error) {
            connection.close();
        }
    });

    // eslint-disable-next-line global-require
    require("./cron/common-crons")();
};

const createHttpServer = () => http.createServer(function (req, res) {
    const redirectURL = `https://${req.headers.host}${req.url}`.replace(HTTP_PORT, HTTPS_PORT);
    res.writeHead(301, { Location: redirectURL });
    res.end();
}).listen(HTTP_PORT);

const createHttpsServer = (_app, sslConfig) => {
    const options = {
        key: fs.readFileSync(path.join(sslConfig.keyPath)),
        cert: fs.readFileSync(path.join(sslConfig.certPath))
    };
    return https.createServer(options, _app);
};

module.exports = {
    startServer
};

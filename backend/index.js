/* eslint-disable global-require */
require("dotenv").config();
const numCPUs = require("node:os").availableParallelism();
const cluster = require("node:cluster");
const fs = require("node:fs");
const path = require("node:path");
const { runMigrationsAndSeeders } = require("./src/database/services/run-migration-seeders");
const logger = require("./src/logger/logger");
/**
 * function to log errors
 * @param {String} message 
 * @param {Object} error 
 * @param {Object} origin 
 */
function logErros(message, error, origin) {
    logger.error(message, { error, origin });
    console.log("error :: :: ", error);
}

/**
 * Listners of uncaughtException and unhandledRejection errors 
 */
process.on("uncaughtException", logErros.bind(this, "Uncaught expception found "));
process.on("unhandledRejection", logErros.bind(this, "Unhandled rejection found "));

// Set Current Working Direcory 
if (!process.env.CURRENT_WORKING_DIRECTORY) {
    process.env.CURRENT_WORKING_DIRECTORY = process.cwd();
}

// global variable to handle data import status
global.dataImportStatus = {};

// add all event names in to an global object to access from anywhere in the codebase
global.eventNames = {
    publisher: "publish-event", // global event type to identify whether the event has to be spread over all workers
    sendSocketMessage: "socket-messages",
    closeConnection: "close-connection",
    dataImportStatusCheck: "data-import-status-check",
    dataImportStart: "import-data-start",
    dataImportEnd: "import-data-end",
    dataImportInProgress: "import-data-in-progress"
};

/**
 * Function to create worker and attach the message handler
 */
const createWorker = function () {
    cluster.fork();
    
    // add message handler for every cluster
    // worker.on("message", messageHandler);
};

/**
 * Function to initiate cluster process in nodejs and add message handler for each cluster
 */
async function initServerWithCluster() {
    if (cluster.isPrimary) {

        // Create as many workers as of the availble number of CPU in host machine
        for (let i = 0; i < numCPUs; i++) {
            createWorker();
        }
      
        /**
         * Listen the exit event for a cluster worker,
         * in case of worker get crashed due to internal error then recreate a new one
         */
        cluster.on("exit", (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
            createWorker();
        });
    } else {
        // Workers can share any TCP connection, In this case it is an HTTP server
        importServerAndStart();
    }
}

/**
 * Function to inport the server and start the server
 */
function importServerAndStart() {
    require("./src/server").startServer();
}

/**
 * Entry point of the server where all migration will get execute at once
 * Start the server
 */
(async function () {
    // create folders for file uplaod if they aren't available while starting the server
    const publicPath = path.resolve("public");
    const formUploadPath = path.resolve("public/form-submissions-uploads");
    const newFomUploadPath = path.resolve("public/fc-uploads");
    if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath);
    if (!fs.existsSync(formUploadPath)) fs.mkdirSync(formUploadPath);
    if (!fs.existsSync(newFomUploadPath)) fs.mkdirSync(newFomUploadPath);
    
    // Execute migrations and seeders for database
    await runMigrationsAndSeeders();

    if (process.env.NODE_ENV === "production") {
        return initServerWithCluster();
    }
    importServerAndStart();
}());
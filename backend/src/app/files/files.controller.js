const fs = require("fs");
const statusCodes = require("../../config/status-codes");
const statusMessage = require("../../config/status-message");
const {
    joinPaths,
    storageDirectoryRoot,
    genusBaseDirectory
} = require("./files.service");

const fetchFile = async (req, res) => {
    const resolvedFileDirectory = joinPaths(
        storageDirectoryRoot,
        genusBaseDirectory,
        decodeURIComponent(req.path.replace("files/", ""))
    );

    if (!fs.existsSync(resolvedFileDirectory)) {
        res.status(statusCodes.NOT_FOUND).json({
            message: statusMessage.FILE_NOT_FOUND
        });
    }

    return res.sendFile(resolvedFileDirectory);
};

const fetchAttachments = async (req, res) => {
    const resolvedFileDirectory = joinPaths(
        storageDirectoryRoot,
        genusBaseDirectory,
        decodeURIComponent(req.path.replace("attachments/", ""))
    );

    if (!fs.existsSync(resolvedFileDirectory)) {
        res.status(statusCodes.NOT_FOUND).json({
            message: statusMessage.FILE_NOT_FOUND
        });
    }

    return res.sendFile(resolvedFileDirectory);
};

module.exports = {
    fetchFile,
    fetchAttachments
};

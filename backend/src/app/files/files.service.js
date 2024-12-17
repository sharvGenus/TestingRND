const mime = require("mime-types");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("crypto");
const sharp = require("sharp");
const statusMessage = require("../../config/status-message");
const { throwError } = require("../../services/throw-error-class");
const statusCodes = require("../../config/status-codes");

const storageDirectoryRoot = [__dirname, "../../../public"];
const genusBaseDirectory = ["Genus", "WFM"];

const supportedExtensionsBySharp = [
    "png",
    "jpeg",
    "jpg",
    "webp",
    "gif",
    "avif",
    "tiff",
    "svg"
];
const isACompressibleImageExtension = (extension) => supportedExtensionsBySharp.includes(extension.toLowerCase());

const joinPaths = (...paths) => {
    const join = [];
    paths.forEach((item) => {
        if (typeof item === "object") {
            join.push(...item);
        } else {
            join.push(item);
        }
    });
    return path.join(...join);
};

const createDirectoryIfNotExists = (directory) => {
    try {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    } catch {
        throw new Error("Error during creation of directory.");
    }
};

const placeFileInDirectory = (directory, fileName, fileBuffer) => {
    try {
        createDirectoryIfNotExists(directory);
        const fileLocation = joinPaths(directory, fileName);
        fs.writeFileSync(fileLocation, fileBuffer);
    } catch {
        throw new Error("Error during file placment.");
    }
};

const parseFileName = (originalFileName) => {
    const fileName = originalFileName.replaceAll(" ", "_");
    if (!fileName.includes(".")) return fileName;
    return fileName.split(".").slice(0, -1).join(".");
};

const md5sumFormFileBuffer = (fileBuffer) => {
    const fileHash = crypto.createHash("md5").update(fileBuffer).digest("hex");
    return fileHash;
};

function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

async function getCompressedImageBuffer(fileExtension, fileBuffer, imageQualityOptions) {
    const compressibleTo = ["jpeg", "png", "webp", "gif"];
    let compressionFormat = fileExtension.toLowerCase();

    // Handle the special case where jpeg is sometimes represented as jpg
    if (compressionFormat === "jpg") compressionFormat = "jpeg";

    if (!compressibleTo.includes(compressionFormat)) {
        // Fallback compression to jpeg
        compressionFormat = "jpeg";
    }

    const { width, height } = imageQualityOptions;
    let { quality } = imageQualityOptions;

    if (["jpeg", "webp", "tiff"].includes(compressionFormat) && !quality) {
        quality = 85; // Default quality value
    }

    const compressedBuffer = await sharp(fileBuffer)
        .resize(width, height, {
            withoutEnlargement: true,
            fit: "inside"
        })[compressionFormat]({ palette: true, quality })
        .toBuffer();

    return { fileBuffer: compressedBuffer, finalExtension: compressionFormat };
}

async function placeBase64EncodedFiles({ reqFiles, featureName, staticFilename = undefined }) {
    const processFilePlacementTask = async (file) => {
        const { fileName, fileData } = file;

        const base64Image = fileData.split(";base64,").pop();
        let fileBuffer = Buffer.from(base64Image, "base64");

        const mimeType = fileData.match(
            /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
        )[1];
        const fileExtension = mime.extension(mimeType);

        if (!fileExtension) {
            throw new Error(statusMessage.FILE_EXTENSION_UNSUPPORTED);
        }

        let finalExtension = fileExtension;

        if (isACompressibleImageExtension(fileExtension)) {
            try {
                const imageQualityOptions = {
                    width: 2448,
                    height: 3264,
                    quality: 85
                };

                ({ fileBuffer, finalExtension } = await getCompressedImageBuffer(fileExtension, fileBuffer, imageQualityOptions));
            } catch (error) {
                throwError(
                    statusCodes.INTERNAL_ERROR,
                    statusMessage.ERROR_PROCESSING_IMAGE,
                    error
                );
            }
        }

        const fileHash = md5sumFormFileBuffer(fileBuffer);
        const uniqueId = generateRandomString(7);

        const transformedFileName = staticFilename ? `${staticFilename}.${fileExtension}` : `${parseFileName(
            fileName
        )}-${fileHash.slice(-7)}-${uniqueId}.${
            finalExtension
        }`;

        const directoryToUse = joinPaths(
            storageDirectoryRoot,
            genusBaseDirectory,
            featureName.split("/")
        );

        placeFileInDirectory(directoryToUse, transformedFileName, fileBuffer);

        const filePath = joinPaths(featureName, transformedFileName);

        return filePath;
    };

    const filePaths = await Promise.all(reqFiles.map(processFilePlacementTask));

    return filePaths;
}

const deleteFile = ({ filePath }) => {
    try {
        const fullFilePath = joinPaths(
            storageDirectoryRoot,
            genusBaseDirectory,
            filePath
        );
        if (fs.existsSync(fullFilePath)) {
            fs.unlinkSync(
                joinPaths(storageDirectoryRoot, genusBaseDirectory, filePath)
            );
        }
        return "File deleted successfully";
    } catch (error) {
        throw new Error("Issues during file deletion.");
    }
};

const processFileTasks = async ({ reqFiles, directory, staticFilename = undefined }) => {
    const tasks = reqFiles.filter((item) => typeof item === "object");

    const deleteTasks = tasks.filter((task) => task.action === "delete");
    const createTasks = tasks.filter((task) => task.action === "create");

    let currentFilesList = reqFiles.filter((item) => typeof item === "string");

    async function processDeleteTask(task) {
        const { filePath } = task;
        deleteFile({ filePath });
        return filePath;
    }

    const deletedResolvedPromises = await Promise.allSettled(deleteTasks.map(processDeleteTask));
    const deletedFiles = deletedResolvedPromises.filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

    const deleteErrors = deletedResolvedPromises.filter((result) => result.status === "rejected");
    if (deleteErrors.length > 0) {
        console.log("files.service.js: deleteErrors", deleteErrors);
    }

    // Remove deleted files from current files list
    currentFilesList = currentFilesList.filter((item) => !deletedFiles.includes(item));

    async function processCreateTask(task) {
        const { fileName, fileData } = task;
        const [filePath] = await placeBase64EncodedFiles({
            reqFiles: [{ fileName, fileData }],
            featureName: directory,
            staticFilename
        });
        return filePath;
    }

    const createdResolvedPromises = await Promise.allSettled(createTasks.map(processCreateTask));
    const createdFiles = createdResolvedPromises.filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

    const createErrors = createdResolvedPromises.filter((result) => result.status === "rejected");
    if (createErrors.length > 0) {
        console.log("files.service.js: createErrors", createErrors);
    }

    return currentFilesList.concat(...createdFiles);
};

module.exports = {
    joinPaths,
    storageDirectoryRoot,
    genusBaseDirectory,
    createDirectoryIfNotExists,
    placeBase64EncodedFiles,
    md5sumFormFileBuffer,
    processFileTasks
};

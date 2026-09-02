const path = require("path");

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

// Empty array means allow every mime type
// Otherwise specify allowed mime types.
const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "pdf",
    "doc",
    "video/mp4",
    "audio/mpeg",
    "video/x-ms-wmv",
    "video/quicktime",
    "webm",
    "mkv",
    "flv",
    "vob",
    "mov",
    "avi",
    "wmv",
    "yuv",
    "amv",
    "mp4",
    "mpg",
    "svi",
    "3gp",
    "3g2",    
    // "audio/mp3",
    // "audio/wav",
    // "video/webm",
    // "video/x-msvideo",    
];

module.exports = (req, res, next) => {

    const {
        fileName,
        fileType,
        fileSize
    } = req.body;

    // ---------------------------
    // Validate required fields
    // ---------------------------

    if (!fileName || !fileType || fileSize === undefined) {
        return res.status(400).json({
            status: "error",
            message: "fileName, fileType and fileSize are required."
        });
    }

    // ---------------------------
    // Validate filename
    // ---------------------------

    if (typeof fileName !== "string" || fileName.length > 255) {
        return res.status(400).json({
            status: "error",
            message: "Invalid file name."
        });
    }

    // Prevent path traversal

    if (
        fileName.includes("..") ||
        fileName.includes("/") ||
        fileName.includes("\\")
    ) {
        return res.status(400).json({
            status: "error",
            message: "Invalid file name."
        });
    }

    // ---------------------------
    // Validate size
    // ---------------------------

    if (!Number.isInteger(fileSize) || fileSize <= 0) {
        return res.status(400).json({
            status: "error",
            message: "Invalid file size."
        });
    }

    if (fileSize > MAX_FILE_SIZE) {
        return res.status(400).json({
            status: "error",
            message: "Maximum upload size is 500 MB."
        });
    }

    // ---------------------------
    // Validate MIME
    // ---------------------------

    if (!allowedMimeTypes.includes(fileType)) {
        return res.status(400).json({
            status: "error",
            message: "Unsupported file type."
        });
    }

    next();
};
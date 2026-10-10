const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
    uploadDocument,
    getDocuments,
    getDocument,
    updateDocument,
    deleteDocument
} = require("../controllers/documentController");

const router = express.Router();

// Create the uploads folder automatically
const uploadFolder = path.join(__dirname, "..", "uploads");

fs.mkdirSync(uploadFolder, { recursive: true });

// File storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname).toLowerCase();

        cb(null, uniqueName);
    }
});

// File upload settings
const upload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024 // Maximum 5 MB
    },

    fileFilter: (req, file, cb) => {
        const allowedExtensions = [
            ".pdf",
            ".jpg",
            ".jpeg",
            ".png"
        ];

        const extension = path.extname(file.originalname).toLowerCase();

        if (allowedExtensions.includes(extension)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only PDF, JPG, JPEG and PNG files are allowed."
                )
            );
        }
    }
});

// Upload a document
router.post(
    "/upload",
    upload.single("document"),
    uploadDocument
);

// Get all documents
router.get("/", getDocuments);

// Get a document by ID
router.get("/:id", getDocument);

// Update document details or status
router.put("/:id", updateDocument);

// Delete a document
router.delete("/:id", deleteDocument);

// Export routes
module.exports = router;
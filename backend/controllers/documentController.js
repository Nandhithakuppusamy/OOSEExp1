const Document = require("../models/Document");
const fs = require("fs");
const path = require("path");

// Upload document
exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select a file."
            });
        }

        const document = await Document.create({
            documentType: req.body.documentType,
            originalName: req.file.originalname,
            fileName: req.file.filename,
            filePath: `/uploads/${req.file.filename}`,
            status: "Pending"
        });

        res.status(201).json({
            success: true,
            message: "Document uploaded successfully.",
            document
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all documents
exports.getDocuments = async (req, res) => {
    try {
        const documents = await Document.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            documents
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get one document
exports.getDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found."
            });
        }

        res.json({
            success: true,
            document
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update document
exports.updateDocument = async (req, res) => {
    try {
        const document = await Document.findByIdAndUpdate(
            req.params.id,
            {
                documentType: req.body.documentType,
                status: req.body.status
            },
            { new: true, runValidators: true }
        );

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found."
            });
        }

        res.json({
            success: true,
            message: "Document updated successfully.",
            document
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete document
exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found."
            });
        }

        const fileName = path.basename(document.filePath);
        const filePath = path.join(__dirname, "..", "uploads", fileName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Document.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Document deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
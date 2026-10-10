const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
    {
        documentType: {
            type: String,
            required: true
        },
        originalName: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        filePath: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Verified", "Rejected"],
            default: "Pending"
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const documentRoutes = require("./routes/documentRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve frontend
app.use(express.static(path.join(__dirname, "..", "frontend")));

// API routes
app.use("/api/documents", documentRoutes);

// Home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/passportAutomation")
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });
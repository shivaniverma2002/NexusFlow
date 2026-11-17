
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/database.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
    try {
        await connectDB();

        server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        server.on("error", (error) => {
            console.error("HTTP server error:", error.message);
            process.exit(1);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

// Graceful shutdown
const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down...`);

    if (server) {
        server.close(async () => {
            try {
                await mongoose.connection.close();
                console.log("MongoDB connection closed.");
                process.exit(0);
            } catch (error) {
                console.error("Shutdown error:", error.message);
                process.exit(1);
            }
        });
    } else {
        process.exit(0);
    }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();

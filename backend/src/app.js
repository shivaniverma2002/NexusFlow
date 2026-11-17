
import express from "express";
import cors from "cors";
import helmet from "helmet";

import verifyToken from "./middleware/authMiddleware.js";
import authorizeRoles from "./middleware/roleMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import { apiLimiter } from "./middleware/rateLimitMiddleware.js";
import supportRoutes from "./routes/supportRoutes.js";


import {
    notFoundMiddleware,
    errorMiddleware
} from "./middleware/errorMiddleware.js";

const app = express();

// Security headers
app.use(
    helmet({
        crossOriginOpenerPolicy: {
            policy: "same-origin-allow-popups"
        }
    })
);

// CORS configuration
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174"
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
);

// Parse JSON requests
app.use(express.json({ limit: "10kb" }));

// Health check - available before API rate limiting
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "NexusFlow AI backend is running!"
    });
});

// Rate limit API requests
app.use("/api", apiLimiter);

// User routes
app.use("/api/users", userRoutes);
// User routes
app.use("/api/users", userRoutes);

// Support request routes
app.use("/api/support", supportRoutes);

// Admin notification routes


// Protected API
app.get("/api/protected", verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: "You are authenticated!",
        user: req.user
    });
});

// Admin-only API
app.get(
    "/api/admin/dashboard",
    verifyToken,
    authorizeRoles("admin"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome to Admin Dashboard!",
            user: req.user
        });
    }
);

// 404 handler
app.use(notFoundMiddleware);

// Global error handler
app.use(errorMiddleware);

export default app;

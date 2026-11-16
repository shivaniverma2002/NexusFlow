import express from "express";
import cors from "cors";
import helmet from "helmet";
import verifyToken from "./middleware/authMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import authorizeRoles from "./middleware/roleMiddleware.js";
import { apiLimiter } from "./middleware/rateLimitMiddleware.js";
import {
    notFoundMiddleware,
    errorMiddleware
} from "./middleware/errorMiddleware.js";
const app = express();

// Security middleware
app.use(helmet());

// Allow React frontend requests
app.use(cors({
    origin: "http://localhost:5174"
}));

// Parse JSON requests
app.use(express.json());
// Register user API routes
app.use("/api", apiLimiter);
app.use("/api/users", userRoutes);
// Apply rate limiting to all API routes
// Health-check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "NexusFlow AI backend is running!"
    });
});
// Protected API - requires valid Firebase token
app.get("/api/protected", verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: "You are authenticated!",
        user: req.user
    });
});
app.get(
    "/api/admin/dashboard",
    verifyToken,
    authorizeRoles("admin"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome to Admin Dashboard!",
            user: req.dbUser
        });
    }
);
app.use(notFoundMiddleware);

// Global error handler
app.use(errorMiddleware);
// Export Express app
export default app;
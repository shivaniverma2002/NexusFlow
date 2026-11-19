
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required"
            });
        }

        // Extract Bearer token
        const [scheme, token] = authHeader.trim().split(/\s+/);

        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required"
            });
        }

        // Check JWT secret configuration
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        // Verify JWT
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ["HS256"] }
        );

        if (!decodedToken.userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }

        // Find user in MongoDB
        const dbUser = await User.findById(decodedToken.userId)
            .select("-password -__v");

        if (!dbUser) {
            return res.status(401).json({
                success: false,
                message: "User profile not found"
            });
        }

        if (!dbUser.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }

        // Attach authenticated user information
        req.user = {
            uid: dbUser._id.toString(),
            email: dbUser.email,
            role: dbUser.role,
            isActive: dbUser.isActive,
            dbUserId: dbUser._id
        };

        next();

    } catch (error) {
        console.error("AUTH MIDDLEWARE ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token"
        });
    }
};

export default verifyToken;

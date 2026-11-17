
import { auth } from "../config/firebaseAdmin.js";
import User from "../models/User.js";

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check authorization header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required"
            });
        }

        // Verify Firebase ID token
        const decodedToken = await auth.verifyIdToken(token);

        // Find corresponding MongoDB user
        const dbUser = await User.findOne({
            firebaseUid: decodedToken.uid
        }).select("-__v");

        // Reject users without a MongoDB profile
        if (!dbUser) {
            return res.status(403).json({
                success: false,
                message: "User profile not found"
            });
        }

        // Reject inactive accounts
        if (!dbUser.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }

        // Attach trusted database user information
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
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

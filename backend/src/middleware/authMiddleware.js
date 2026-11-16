
import { auth } from "../config/firebaseAdmin.js";
import User from "../models/User.js";

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required"
            });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = await auth.verifyIdToken(token);

        req.user = decodedToken;

        // Check MongoDB account status
        const dbUser = await User.findOne({
            firebaseUid: decodedToken.uid
        });

        if (dbUser && !dbUser.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default verifyToken;

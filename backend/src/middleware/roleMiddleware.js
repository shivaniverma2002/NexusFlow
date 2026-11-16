import User from "../models/User.js";

const authorizeRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findOne({
                firebaseUid: req.user.uid
            });

            if (!user || !user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission"
                });
            }

            req.dbUser = user;
            next();

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Authorization failed"
            });
        }
    };
};

export default authorizeRoles;
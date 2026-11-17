
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // Ensure authentication middleware has executed
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            // Check role from verified MongoDB user
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to access this resource"
                });
            }

            next();

        } catch (error) {
            console.error("ROLE AUTHORIZATION ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Authorization failed"
            });
        }
    };
};

export default authorizeRoles;

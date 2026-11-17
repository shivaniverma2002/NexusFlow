import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import {
    createUserProfile,
    getMyProfile,
    updateMyProfile,
    getAllUsers,
    updateUser,
    deleteUser,
    updateUserStatus,
    getDashboardStats,
    adminCreateUser
} from "../controllers/userController.js";
import validateMiddleware from "../middleware/validateMiddleware.js";
import {
    createUserSchema,
    updateUserSchema,
    updateUserStatusSchema
} from "../validators/userValidator.js";

import authorizeRoles from "../middleware/roleMiddleware.js";
const router = express.Router();

// Create user profile (authentication required)
router.post(
    "/profile",
    verifyToken,
    validateMiddleware(createUserSchema),
    createUserProfile
);
router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, updateMyProfile);

router.get(
    "/admin/users",
    verifyToken,
    authorizeRoles("admin"),
    getAllUsers
);

// Admin: Create new user
router.post(
    "/admin/users",
    verifyToken,
    authorizeRoles("admin"),
    adminCreateUser
);
router.put(
    "/admin/users/:id",
    verifyToken,
    authorizeRoles("admin"),
    validateMiddleware(updateUserSchema),
    updateUser
);
router.delete(
    "/admin/users/:id",
    verifyToken,
    authorizeRoles("admin"),
    deleteUser
);
router.patch(
    "/admin/users/:id/status",
    verifyToken,
    authorizeRoles("admin"),
    validateMiddleware(updateUserStatusSchema),
    updateUserStatus
);
router.get(
    "/admin/stats",
    verifyToken,
    authorizeRoles("admin"),
    getDashboardStats
);
export default router;

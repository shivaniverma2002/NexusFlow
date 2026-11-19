
import express from "express";

import verifyToken from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import validateMiddleware from "../middleware/validateMiddleware.js";

import {
    registerUser,
    loginUser,
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

import {
    createUserSchema,
    registerUserSchema,
    loginUserSchema,
    updateUserSchema,
    updateUserStatusSchema,
    adminCreateUserSchema
} from "../validators/userValidator.js";

const router = express.Router();

// Authenticated user profile routes
router.post(
    "/profile",
    verifyToken,
    validateMiddleware(createUserSchema),
    createUserProfile
);

router.get(
    "/me",
    verifyToken,
    getMyProfile
);

router.put(
    "/me",
    verifyToken,
    updateMyProfile
);

// Admin-only user management routes
router.get(
    "/admin/users",
    verifyToken,
    authorizeRoles("admin"),
    getAllUsers
);

router.post(
    "/admin/users",
    verifyToken,
    authorizeRoles("admin"),
    validateMiddleware(adminCreateUserSchema),
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
// Public authentication routes
router.post(
    "/register",
    validateMiddleware(registerUserSchema),
    registerUser
);

router.post(
    "/login",
    validateMiddleware(loginUserSchema),
    loginUser
);
export default router;

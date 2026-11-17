
import express from "express";

import verifyToken from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

import {
    createSupportRequest,
    getSupportNotifications,
    markSupportNotificationRead,
    resolveSupportRequest
} from "../controllers/supportController.js";

const router = express.Router();

// User submits support request
router.post(
    "/",
    verifyToken,
    createSupportRequest
);

// Admin views support notifications
router.get(
    "/notifications",
    verifyToken,
    authorizeRoles("admin"),
    getSupportNotifications
);

// Admin marks notification as read
router.patch(
    "/notifications/:id/read",
    verifyToken,
    authorizeRoles("admin"),
    markSupportNotificationRead
);
router.patch(
    "/:id/resolve",
    verifyToken,
    authorizeRoles("admin"),
    resolveSupportRequest
);

export default router;

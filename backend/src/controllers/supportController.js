
import SupportRequest from "../models/SupportRequest.js";

// User submits a support request
export const createSupportRequest = async (req, res) => {
    try {
        const { name, subject, message } = req.body;

        if (!name?.trim() || !subject?.trim() || !message?.trim()) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (message.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: "Message must contain at least 10 characters"
            });
        }

        if (!req.user.dbUserId) {
            return res.status(403).json({
                success: false,
                message: "User profile not found"
            });
        }

        const supportRequest = await SupportRequest.create({
            userId: req.user.dbUserId,
            name: name.trim(),
            email: req.user.email,
            subject: subject.trim(),
            message: message.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Support request submitted successfully",
            supportRequest
        });

    } catch (error) {
        console.error("CREATE SUPPORT REQUEST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit support request"
        });
    }
};

// Admin retrieves support requests
export const getSupportNotifications = async (req, res) => {
    try {
        const requests = await SupportRequest.find({
    status: { $ne: "resolved" }
})
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

const unreadCount = await SupportRequest.countDocuments({
    isRead: false,
    status: { $ne: "resolved" }
});

        return res.status(200).json({
            success: true,
            requests,
            unreadCount
        });

    } catch (error) {
        console.error("GET SUPPORT NOTIFICATIONS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });
    }
};

// Admin marks a notification as read
export const markSupportNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[a-f\d]{24}$/i.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID"
            });
        }

        const request = await SupportRequest.findByIdAndUpdate(
            id,
            { $set: { isRead: true } },
            { new: true, runValidators: true }
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            request
        });

    } catch (error) {
        console.error("MARK NOTIFICATION READ ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update notification"
        });
    }
};

// Admin resolves a support request
export const resolveSupportRequest = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[a-f\d]{24}$/i.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid support request ID"
            });
        }

        const request = await SupportRequest.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: "resolved",
                    isRead: true
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).populate("userId", "name email");

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Support request not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Support request resolved successfully",
            request
        });

    } catch (error) {
        console.error("RESOLVE SUPPORT REQUEST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to resolve support request"
        });
    }
};

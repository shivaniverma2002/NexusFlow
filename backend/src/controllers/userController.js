import User from "../models/User.js";
import mongoose from "mongoose";
import { auth } from "../config/firebaseAdmin.js";

// Create or retrieve user profile
export const createUserProfile = async (req, res) => {
    try {
        const { name } = req.body;

        // Get verified Firebase user details
        const firebaseUid = req.user.uid;
        const email = req.user.email;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        // Find existing profile or create a new one
        const user = await User.findOneAndUpdate(
            { firebaseUid },
            {
                $setOnInsert: {
                    firebaseUid,
                    name,
                    email,
                    role: "user"
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "User profile saved successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to save user profile"
        });
    }
};
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findOne({
            firebaseUid: req.user.uid
        }).select("-__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user profile"
        });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

        const { role, isActive } = req.query;
       const search = (req.query.search || "").trim();
        
        // Search by name or email
         if (search.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Search query cannot exceed 100 characters"
            });
        }
        const filter = {};

        // Filter by role
        if (role && ["admin", "user"].includes(role)) {
            filter.role = role;
        }

        // Filter by account status
        if (isActive === "true" || isActive === "false") {
            filter.isActive = isActive === "true";
        }

        const skip = (page - 1) * limit;

        const users = await User.find(filter)
            .select("-__v")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments(filter);

        res.status(200).json({
            success: true,
            users,
            pagination: {
                totalUsers,
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
                limit
            }
        });

    } catch (error) {
    console.error("GET ALL USERS ERROR:", error);

    res.status(500).json({
        success: false,
        message: "Failed to fetch users",
        error: error.message
    });
}
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role } = req.body;

        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        // Validate input
        if (
            (name !== undefined &&
                (typeof name !== "string" || !name.trim())) ||
            (role !== undefined &&
                !["admin", "user"].includes(role))
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid name or role"
            });
        }

        if (name === undefined && role === undefined) {
            return res.status(400).json({
                success: false,
                message: "Provide at least one field to update"
            });
        }

        const updateData = {};

        if (name !== undefined) updateData.name = name.trim();
        if (role !== undefined) updateData.role = role;

        const user = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update user"
        });
    }
};



export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent deleting your own account
        if (user.firebaseUid === req.user.uid) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        // Delete Firebase account first
        await auth.deleteUser(user.firebaseUid);

        // Delete MongoDB profile
        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
};

export const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be true or false"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.firebaseUid === req.user.uid && !isActive) {
            return res.status(400).json({
                success: false,
                message: "You cannot deactivate your own account"
            });
        }

        user.isActive = isActive;
        await user.save();

        // Revoke existing Firebase refresh tokens when deactivating.
        if (!isActive) {
            await auth.revokeRefreshTokens(user.firebaseUid);
        }

        res.status(200).json({
            success: true,
            message: `User ${isActive ? "activated" : "deactivated"} successfully`,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update user status"
        });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalAdmins,
            activeUsers,
            inactiveUsers
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ isActive: true }),
            User.countDocuments({ isActive: false })
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalAdmins,
                activeUsers,
                inactiveUsers
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
};

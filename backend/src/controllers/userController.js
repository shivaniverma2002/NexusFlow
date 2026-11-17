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
                 returnDocument: "after",
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

// Admin: Create a new user or administrator

// Admin can create NORMAL USERS only
export const adminCreateUser = async (req, res) => {
    let firebaseUser;

    try {
        const { name, email, password } = req.body;

        if (!name?.trim() || !email?.trim() || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Create Firebase account
        firebaseUser = await auth.createUser({
            email: normalizedEmail,
            password,
            displayName: name.trim()
        });

        // Always assign user role
        const user = await User.create({
            firebaseUid: firebaseUser.uid,
            name: name.trim(),
            email: normalizedEmail,
            role: "user",
            isActive: true
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        });

    } catch (error) {
        if (firebaseUser) {
            try {
                await auth.deleteUser(firebaseUser.uid);
            } catch (rollbackError) {
                console.error("Firebase rollback failed:", rollbackError.message);
            }
        }

        console.error("ADMIN CREATE USER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create user"
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

        const search = (req.query.search || "").trim();

        if (search.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Search query cannot exceed 100 characters"
            });
        }

        // Always show regular users only
        const filter = {
            role: "user"
        };

        // Filter by account status
        if (req.query.isActive === "true" || req.query.isActive === "false") {
            filter.isActive = req.query.isActive === "true";
        }

        // Search by name or email
        if (search) {
            const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.$or = [
                { name: { $regex: safeSearch, $options: "i" } },
                { email: { $regex: safeSearch, $options: "i" } }
            ];
        }

        const skip = (page - 1) * limit;

        const users = await User.find(filter)
            .select("-__v")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments(filter);

        return res.status(200).json({
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

        return res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};


export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        // Role changes are not allowed
        if (role !== undefined) {
            return res.status(403).json({
                success: false,
                message: "User roles cannot be changed"
            });
        }

        if (
            typeof name !== "string" ||
            !name.trim() ||
            name.trim().length < 2 ||
            name.trim().length > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 2 and 100 characters"
            });
        }

        const user = await User.findOneAndUpdate(
            { _id: id, role: "user" },
            { $set: { name: name.trim() } },
            { new: true, runValidators: true }
        ).select("-__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });

    } catch (error) {
        console.error("UPDATE USER ERROR:", error);

        return res.status(500).json({
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

export const updateMyProfile = async (req, res) => {
    try {
        const { name } = req.body;

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Valid name is required"
            });
        }

        if (name.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name cannot exceed 100 characters"
            });
        }

        const user = await User.findOneAndUpdate(
            { firebaseUid: req.user.uid },
            { $set: { name: name.trim() } },
            {
                returnDocument: "after",
                runValidators: true
            }
        ).select("-__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.error("UPDATE MY PROFILE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile"
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

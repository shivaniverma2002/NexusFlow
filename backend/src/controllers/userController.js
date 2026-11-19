import User from "../models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Create or retrieve user profile
// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        // Check if email already exists
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "user",
            isActive: true
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
                algorithm: "HS256"
            }
        );

        const safeUser = await User.findById(user._id)
            .select("-password -__v");

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: safeUser
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};
// Admin: Create a new user or administrator
// Login existing user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        // Find user and explicitly include password
        const user = await User.findOne({
            email: normalizedEmail
        }).select("+password");

        if (!user || !user.password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password. Existing accounts may need password setup."
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check account status
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is deactivated"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
                algorithm: "HS256"
            }
        );

        // Remove sensitive fields
        const safeUser = await User.findById(user._id)
            .select("-password -__v");

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: safeUser
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};
// Admin can create NORMAL USERS only
export const adminCreateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name?.trim() || !email?.trim() || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters"
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

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "user",
            isActive: true
        });

        const safeUser = await User.findById(user._id)
            .select("-password -__v");

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: safeUser
        });

    } catch (error) {
        console.error("ADMIN CREATE USER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create user"
        });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.dbUserId)
            .select("-password -__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("GET MY PROFILE ERROR:", error);

        return res.status(500).json({
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
            .select("-password -__v")
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

        if (id === req.user.dbUserId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        const user = await User.findOneAndDelete({
            _id: id,
            role: "user"
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("DELETE USER ERROR:", error);

        return res.status(500).json({
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

        if (
            id === req.user.dbUserId.toString() &&
            !isActive
        ) {
            return res.status(400).json({
                success: false,
                message: "You cannot deactivate your own account"
            });
        }

        const user = await User.findOneAndUpdate(
            { _id: id, role: "user" },
            { $set: { isActive } },
            { new: true, runValidators: true }
        ).select("-password -__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: `User ${isActive ? "activated" : "deactivated"} successfully`,
            user
        });

    } catch (error) {
        console.error("UPDATE USER STATUS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update user status"
        });
    }
};

export const updateMyProfile = async (req, res) => {
    try {
        const { name } = req.body;

        if (
            typeof name !== "string" ||
            name.trim().length < 2 ||
            name.trim().length > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 2 and 100 characters"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.dbUserId,
            { $set: { name: name.trim() } },
            { new: true, runValidators: true }
        ).select("-password -__v");

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

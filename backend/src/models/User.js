
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firebaseUid: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 254
        },

        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
            required: true,
            index: true
        },

        isActive: {
            type: Boolean,
            default: true,
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

// Compound index for admin user listing and filtering
userSchema.index({ role: 1, isActive: 1, createdAt: -1 });

// Create User model
const User = mongoose.model("User", userSchema);

export default User;

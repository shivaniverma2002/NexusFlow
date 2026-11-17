
import mongoose from "mongoose";

const supportRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 254
        },
        subject: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },
        message: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 3000
        },
        status: {
            type: String,
            enum: ["open", "in-progress", "resolved"],
            default: "open"
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true
        }
    },
    {
        timestamps: true
    }
);

supportRequestSchema.index({ isRead: 1, createdAt: -1 });

const SupportRequest = mongoose.model(
    "SupportRequest",
    supportRequestSchema
);

export default SupportRequest;

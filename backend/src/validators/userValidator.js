
import { z } from "zod";

// User profile creation
export const createUserSchema = z.object({
    name: z.string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(100, "Name cannot exceed 100 characters")
}).strict();

// Admin creates a user

export const adminCreateUserSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email(),
    password: z.string().min(6)
}).strict();

// Admin updates a user
export const updateUserSchema = z.object({
    name: z.string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(100, "Name cannot exceed 100 characters")
        .optional(),

    role: z.enum(["admin", "user"]).optional()
}).strict().refine(
    data => data.name !== undefined || data.role !== undefined,
    {
        message: "At least one field is required"
    }
);

// Admin activates/deactivates a user
export const updateUserStatusSchema = z.object({
    isActive: z.boolean()
}).strict();

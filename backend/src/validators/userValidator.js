
import { z } from "zod";

// User profile creation
export const createUserSchema = z.object({
    name: z.string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(100, "Name cannot exceed 100 characters")
}).strict();

// User registration
export const registerUserSchema = z.object({
    name: z.string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),

    email: z.string()
        .trim()
        .toLowerCase()
        .email("Enter a valid email address")
        .max(254),

    password: z.string()
        .min(8, "Password must contain at least 8 characters")
}).strict();

// Admin creates a normal user
export const adminCreateUserSchema = z.object({
    name: z.string().trim().min(2).max(100),

    email: z.string()
        .trim()
        .toLowerCase()
        .email()
        .max(254),

    password: z.string().min(8)
}).strict();

// Admin updates a user
export const updateUserSchema = z.object({
    name: z.string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(100, "Name cannot exceed 100 characters")
}).strict();

// Admin activates/deactivates a user
export const updateUserStatusSchema = z.object({
    isActive: z.boolean()
}).strict();
// User login
export const loginUserSchema = z.object({
    email: z.string()
        .trim()
        .toLowerCase()
        .email("Enter a valid email address")
        .max(254),

    password: z.string()
        .min(1, "Password is required")
}).strict();

import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(50, "Name cannot exceed 50 characters")
});

export const updateUserSchema = z.object({
    name: z.string()
        .trim()
        .min(2)
        .max(50)
        .optional(),

    role: z.enum(["admin", "user"]).optional()
}).refine(
    (data) => data.name !== undefined || data.role !== undefined,
    {
        message: "At least one field is required"
    }
);

export const updateUserStatusSchema = z.object({
    isActive: z.boolean()
});

import { z } from "zod";

export const NotificationSchema = z.object({
    userId: z.string().min(1, "User ID is required"),

    message: z
        .string()
        .min(1, "Message is required"),

    icon: z
        .string()
        .min(1, "Icon is required"),

    type: z.enum([
        "info",
        "warning",
        "error",
        "success"
    ])
});

export const NotificationIdSchema = z.object({
    id: z
        .string()
        .min(1, "Notification ID is required")
});
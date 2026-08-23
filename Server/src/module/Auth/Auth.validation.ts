import { z } from 'zod'

export const SignupValidation = z.object({
    name: z
        .string()
        .min(2, "Name must contain at least 2 characters")
        .max(50, "Name maximum length is 50 characters"),

    email: z.email("Invalid email address")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters")
        .max(16, "Password maximum length is 16 characters"),

    mobile: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

    address: z
        .string()
        .min(10, "Address must contain at least 10 characters")
        .max(50, "Address maximum length is 50 characters")
});

export const LoginValidation = z.object({
    email: z.email("Invalid email address").trim().toLowerCase(),
    password: z
        .string()
        .min(8, "Password must contain at least 8 characters")
        .max(16, "Password maximum length is 16 characters"),
})

export const GetProfileValidation = z.object({
    id: z.string().length(24, "Invalid user ID"),
})

export const DeleteProfileValidation = z.object({
    id: z.string().length(24, "Invalid user ID"),
})

export const UpdateProfileValidation = z.object({
    name: z
        .string()
        .min(2, "Name must contain at least 2 characters")
        .max(50, "Name maximum length is 50 characters")
        .optional(),
    email: z.email("Invalid email address")
        .trim()
        .toLowerCase(),
    address: z
        .string()
        .min(10, "Address must contain at least 10 characters")
        .max(50, "Address maximum length is 50 characters")
        .optional(),
    id: z.string().length(24, "Invalid user ID"),
    phone: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number")
        .optional()
})
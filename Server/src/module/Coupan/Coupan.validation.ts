import { z } from "zod";

export const CreateCoupanSchema = z.object({
    name: z
        .string()
        .min(1, "Coupon name is required")
        .trim(),

    description: z
        .string()
        .min(1, "Coupon description is required")
        .trim(),

    code: z
        .string()
        .min(1, "Coupon code is required")
        .trim()
        .toUpperCase(),

    discount: z
        .coerce
        .number()
        .min(0, "Discount cannot be negative")
        .max(100, "Discount cannot exceed 100"),

    isActive: z
        .boolean()
        .optional()
        .default(true),

    expiryDate: z
        .coerce
        .date()
        .refine(
            (date) => date > new Date(),
            "Expiry date must be in the future"
        )
});


export const UpdateCoupanSchema = z.object({
    name: z
        .string()
        .min(1, "Coupon name is required")
        .trim()
        .optional(),

    description: z
        .string()
        .min(1, "Coupon description is required")
        .trim()
        .optional(),

    code: z
        .string()
        .min(1, "Coupon code is required")
        .trim()
        .toUpperCase()
        .optional(),

    discount: z
        .coerce
        .number()
        .min(0, "Discount cannot be negative")
        .max(100, "Discount cannot exceed 100")
        .optional(),

    isActive: z
        .boolean()
        .optional(),

    expiryDate: z
        .coerce
        .date()
        .refine(
            (date) => date > new Date(),
            "Expiry date must be in the future"
        )
        .optional()
});


export const CoupanIdSchema = z.object({
    id: z
        .string()
        .min(1, "Coupon ID is required")
});
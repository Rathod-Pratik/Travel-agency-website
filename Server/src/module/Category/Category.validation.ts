import { z } from "zod";

export const CategorySchema = z.object({
    name: z
        .string()
        .min(1, "Category name is required")
        .max(100, "Category name cannot exceed 100 characters"),

    slug: z
        .string()
        .min(1, "Slug is required"),

    description: z
        .string()
        .optional(),

    icon: z
        .string()
        .optional(),

    isHomePage: z
        .coerce
        .boolean()
        .optional()
});

export const UpdateCategorySchema =
    CategorySchema.partial();

export const CategoryIdSchema = z.object({
    id: z
        .string()
        .min(1, "Category ID is required")
});
import {z} from "zod";

export const CategorySchema = z.object({
    name: z.string().min(1, "Category name is required").max(100, "Category name must be less than 100 characters"),
    slug: z.string().min(1, "Category slug is required").max(100, "Category slug must be less than 100 characters"),
    description: z.string().optional(),
    icon: z.string().optional(),
    isHomePage: z.boolean().optional()
});

export const CategoryIdSchema = z.object({
    id: z.string().min(1, "Category ID is required")
});
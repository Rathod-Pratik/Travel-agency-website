import { z } from "zod";


export const ContentTypeEnum = z.enum([
    "terms",
    "privacy",
    "about",
    "help",
    "contact",
    "cookie-policy",
    "travel-policy",
    "payment-policy",
    "booking-policy"
]);


export const CreateContentSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required"),

    slug: z
        .string()
        .min(1, "Slug is required"),

    type: ContentTypeEnum,

    content: z
        .string()
        .min(1, "Content is required"),

    isActive: z
        .boolean()
        .optional()
});


export const UpdateContentSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .optional(),

    slug: z
        .string()
        .min(1, "Slug is required")
        .optional(),

    type: ContentTypeEnum.optional(),

    content: z
        .array(z.string().min(1))
        .min(1, "At least one content item is required"),

    isActive: z
        .boolean()
        .optional()
});
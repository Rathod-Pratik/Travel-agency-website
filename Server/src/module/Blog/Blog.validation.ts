import { z } from "zod";

export const IBlogSchema = z.object({
    title: z.string().min(1, "Title cannot be empty").max(100),
    description: z.string().max(200)
});

export const IUpdateBlogSchema = z.object({
    id: z.string().min(1, "Blog ID cannot be empty"),
    title: z.string().min(1, "Title cannot be empty").max(100),
    description: z.string().max(200)
});

export const IGetBlogSchema = z.object({
    id: z.string().min(1, "Blog ID cannot be empty")
});

export const IGetBlogsSchema = z.object({
    page: z.number().min(1, "Page number must be greater than 0").optional(),
    limit: z.number().min(1, "Limit must be greater than 0").optional()
});
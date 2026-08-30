import { z } from "zod";

const StringArraySchema = z.preprocess(
    (value) => {
        if (typeof value === "string") {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }

        return value;
    },
    z.array(z.string().min(1))
);

export const BlogSchema = z.object({
    title: z.string().min(1, "Title is required"),

    description: StringArraySchema,
});

export const UpdateBlogSchema = BlogSchema.partial();

export const BlogIdSchema = z.object({
    id: z.string().min(1, "Blog ID is required"),
});
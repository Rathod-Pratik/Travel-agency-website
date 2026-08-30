import { z } from "zod";

export const AddWishlistSchema = z.object({
    tourId: z.string().min(1, "Tour ID is required"),
});

export const RemoveWishlistSchema = z.object({
    tourId: z.string().min(1, "Tour ID is required"),
});
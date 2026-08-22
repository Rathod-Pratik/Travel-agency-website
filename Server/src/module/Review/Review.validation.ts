import {z} from 'zod';

export const CreateReviewSchema = z.object({
    userId: z.string().uuid(),
    TourId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    reviewText: z.string().trim().max(200)
});

export const UpdateReviewSchema = z.object({
    userId: z.string().uuid().optional(),
    TourId: z.string().uuid().optional(),
    rating: z.number().min(1).max(5).optional(),
    reviewText: z.string().trim().max(200).optional()
});

export const ReviewIdSchema = z.object({
    _id: z.string().uuid()
});
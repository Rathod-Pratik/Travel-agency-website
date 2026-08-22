import {z} from 'zod';

export const TourValidation = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    slug: z.string().min(1, { message: "Slug is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    destination: z.object({
        country: z.string().min(1, { message: "Country is required" }),
        city: z.string().min(1, { message: "City is required" }),
    }),
    duration: z.object({
        days: z.number().min(1, { message: "Days must be at least 1" }),
        nights: z.number().min(0, { message: "Nights must be at least 0" }),
    }),
    price: z.number().min(0, { message: "Price must be at least 0" }),
    discountPrice: z.number().min(0, { message: "Discount price must be at least 0" }).optional(),
    currency: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
})

export const TourIdValidation = z.object({
    id: z.string().min(1, { message: "ID is required" }),
});
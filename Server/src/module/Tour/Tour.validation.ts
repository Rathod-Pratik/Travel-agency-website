import { z } from 'zod';

export const TourValidation = z.object({
    title: z
        .string()
        .min(1, "Title is required"),

    slug: z
        .string()
        .min(1, "Slug is required"),

    description: z
        .string()
        .min(1, "Description is required"),

    country: z
        .string()
        .min(1, "Country is required"),

    city: z
        .string()
        .min(1, "City is required"),

    category: z
        .string()
        .min(1, "Category is required"),

    days: z.coerce
        .number()
        .min(1, "Days must be at least 1"),

    nights: z.coerce
        .number()
        .min(0, "Nights must be at least 0"),

    included: z.preprocess(
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
        z.array(z.string())
    ),

    notIncluded: z.preprocess(
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
        z.array(z.string())
    ),

    itinerary: z.preprocess(
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
        z.array(
            z.object({
                day: z.coerce
                    .number()
                    .min(1, "Day must be at least 1"),

                title: z
                    .string()
                    .min(1, "Title is required"),

                description: z
                    .string()
                    .min(1, "Description is required"),

                activities: z.preprocess(
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
                    z.array(z.string())
                ),
            })
        )
    ),

    maxSeats: z.coerce
        .number()
        .min(1, "Max seats must be at least 1"),

    availableSeats: z.coerce
        .number()
        .min(0, "Available seats must be at least 0"),

    rating: z.coerce
        .number()
        .min(0, "Rating must be at least 0")
        .max(5, "Rating cannot exceed 5"),

    price: z.coerce
        .number()
        .min(0, "Price must be at least 0"),

    status: z.enum([
        "active",
        "inactive",
        "completed",
        "Cancelled",
    ]),

    featured: z.preprocess(
        (value) => {
            if (typeof value === "string") {
                return value === "true";
            }

            return value;
        },
        z.boolean()
    ),

    discountPrice: z.coerce
        .number()
        .min(0, "Discount price must be at least 0")
        .optional(),

    currency: z
        .string()
        .optional(),

    startDate: z.preprocess(
        (value) => {
            if (typeof value === "string" && value.trim() !== "") {
                return new Date(value);
            }

            return value;
        },
        z.date().optional()
    ),

    endDate: z.preprocess(
        (value) => {
            if (typeof value === "string" && value.trim() !== "") {
                return new Date(value);
            }

            return value;
        },
        z.date().optional()
    ),
});
export const UpdateTourValidation = TourValidation.partial();
export const TourIdValidation = z.object({
    id: z.string().min(1, { message: "ID is required" }),
});
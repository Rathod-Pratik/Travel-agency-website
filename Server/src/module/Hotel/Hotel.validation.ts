import { z } from "zod";

export const HotelSchema = z.object({
    name: z.string().min(1, "Name is required"),
    rating: z.coerce.number().min(0, "Rating must be at least 0").max(5, "Rating cannot exceed 5"),
    address: z.string().min(1, "Address is required"),
    roomType: z.string().min(1, "Room type is required"),
    meal: z.preprocess(
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
        z.object({
            breakfast: z.boolean().optional(),
            lunch: z.boolean().optional(),
            dinner: z.boolean().optional(),
        })
    ),
    amenities: z.preprocess(
        (value) => {
            if (typeof value === "string") {
                try {
                    return JSON.parse(value);
                } catch {
                    return value;
                }
            }
        },
        z.array(z.string()).optional()
    ),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    description: z.string().optional(),
    pricePerPerson: z.coerce.number().min(0, "Price per person must be at least 0"),
    availableRooms: z.coerce.number().min(0, "Available rooms must be at least 0"),
    isActive: z
        .enum(["active", "inactive", "draft"])
        .optional()
        .default("active"),

});

export const UpdateHotelSchema = HotelSchema.partial();

export const HotelIdSchema = z.object({
    id: z.string().min(1, "Hotel ID is required"),
});
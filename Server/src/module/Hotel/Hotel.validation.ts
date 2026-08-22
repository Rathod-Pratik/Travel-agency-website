import {z} from "zod";

export const HotelSchema = z.object({
    name: z.string().min(1, "Name is required"),
    rating: z.number().min(0, "Rating must be at least 0").max(5, "Rating cannot exceed 5"),
    address: z.string().min(1, "Address is required"),
    roomType: z.enum(["Single", "Double"], "Room type must be either 'Single' or 'Double'"),
    meal: z.object({
        name: z.string().min(1, "Meal name is required"),
        breakfast: z.boolean().optional(),
        lunch: z.boolean().optional(),
        dinner: z.boolean().optional(),
    }),
    pricePerPerson: z.number().min(0, "Price per person must be at least 0"),
    availableRooms: z.number().min(0, "Available rooms must be at least 0"),
    isActive: z.boolean().optional(),
});

export const HotelIdSchema = z.object({
    id: z.string().min(1, "Hotel ID is required"),
});
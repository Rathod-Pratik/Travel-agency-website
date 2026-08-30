import { z } from "zod";

export const TravellerDetailsSchema = z.object({
    name: z
        .string()
        .min(1, "Traveller name is required"),

    age: z
        .coerce
        .number()
        .min(1, "Traveller age must be at least 1"),

    document: z
        .string()
        .min(1, "Traveller document is required")
});

export const CreateBookingSchema = z.object({
    code: z
        .string()
        .min(1, "Booking code is required"),

    userId: z
        .string()
        .min(1, "User ID is required"),

    tourId: z
        .string()
        .min(1, "Tour ID is required"),

    noOfSeats: z
        .coerce
        .number()
        .min(1, "Number of seats must be at least 1"),

    travellerDetails: TravellerDetailsSchema,

    date: z.coerce.date(),

    amount: z
        .coerce
        .number()
        .min(0, "Amount cannot be negative"),

    paymentId: z
        .string()
        .min(1, "Payment ID is required")
});

export const UpdateBookingStatusSchema = z.object({
    status: z.enum([
        "Booked",
        "Cancelled",
        "Pending"
    ])
});

export const CancelBookingSchema = z.object({
    refundAmount: z
        .coerce
        .number()
        .min(0)
        .optional(),

    refundStatus: z
        .enum([
            "NOT_APPLICABLE",
            "PENDING",
            "PROCESSING",
            "REFUNDED",
            "FAILED"
        ])
        .optional()
});

export const BookingIdSchema = z.object({
    id: z
        .string()
        .min(1, "Booking ID is required")
});
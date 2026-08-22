import {z} from 'zod';

export const BookingValidation = z.object({
    tourId: z.string().min(1, { message: "Tour ID is required" }),
    travellerDetails: z.object({
        name: z.string().min(1, { message: "Traveller name is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        phone: z.string().min(10, { message: "Invalid phone number" })
    }),
    date: z.string().min(1, { message: "Booking date is required" }),
    amount: z.number().min(0, { message: "Amount cannot be negative" }),
    paymentId: z.string().min(1, { message: "Payment ID is required" }),
    status: z.enum(["Booked", "Cancelled", "Pending"]).optional()
});

export const BookingIdValidation = z.object({
    id: z.string().min(1, { message: "Booking ID is required" })
});

export const CancelBookingValidation = z.object({
    id: z.string().min(1, { message: "Booking ID is required" }),
    reason: z.string().min(1, { message: "Cancellation reason is required" }),
    description: z.string().optional(),
    refundAmount: z.number().min(0, { message: "Refund amount cannot be negative" }),
    refundStatus: z.enum(["PENDING", "REFUNDED", "FAILED"]).optional()
});
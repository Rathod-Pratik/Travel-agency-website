import {z} from "zod";

export const PaymentSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    tourId: z.string().min(1, "Tour ID is required"),
    amount: z.number().min(0, "Amount must be at least 0"),
    currency: z.string().min(1, "Currency is required"),
    paymentMethod: z.string().min(1, "Payment Method is required"),
    paymentStatus: z.string().min(1, "Payment Status is required"),
    paymentId: z.string().min(1, "Payment ID is required"),
});

export const VerifyPaymentSchema = z.object({
    orderId: z.string().min(1, "Order ID is required"),
    paymentId: z.string().min(1, "Payment ID is required"),
    signature: z.string().min(1, "Signature is required"),
});

export const RefundSchema = z.object({
    paymentId: z.string().min(1, "Payment ID is required"),
    amount: z.number().min(0, "Refund amount must be at least 0"),
    reason: z.string().optional(),
});


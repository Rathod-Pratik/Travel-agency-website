import mongoose from "mongoose";

export interface IPayment {
    userId: mongoose.Types.ObjectId;
    tourId: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    createdAt: Date;
    paymentMethod: string;
    paymentStatus: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    status: "Pending" | "Completed" | "Failed" | "Refunded";
    reason?: string;
}
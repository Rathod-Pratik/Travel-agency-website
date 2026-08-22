import mongoose, { HydratedDocument } from 'mongoose';
import { IPayment } from './Payment.types';

const PaymentSchema = new mongoose.Schema<IPayment>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    tourId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Tour ID is required'],
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
    },
    razorpayOrderId: {
        type: String,
        required: [true, 'Razorpay Order ID is required'],
    },
    razorpayPaymentId: {
        type: String,
    },
    razorpaySignature: {
        type: String,
    },
    status:{
        type: String,
        enum: ["Pending", "Completed", "Failed", "Refunded"],
        default: "Pending"
    },
    reason:{
        type: String,
    }
});

export type PaymentDocument = HydratedDocument<IPayment>;

export const PaymentModel = mongoose.model<IPayment>('Payment', PaymentSchema);
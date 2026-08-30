import mongoose from "mongoose";

export type BookingStatus =
    | "Booked"
    | "Cancelled"
    | "Pending";

export type RefundStatus =
    | "NOT_APPLICABLE"
    | "PENDING"
    | "PROCESSING"
    | "REFUNDED"
    | "FAILED";

export interface TravellerDetails {
    name: string;
    age: number;
    document: string;
}[]

export interface CancellationDetails {
    reason?: string;
    description?: string;
    cancelledBy?: mongoose.Types.ObjectId;
    cancelledAt?: Date;
    refundAmount?: number;
    refundStatus?: RefundStatus;
}

export interface IBooking {
    invoiceNumber: string;
    userId: mongoose.Types.ObjectId;
    tourId: mongoose.Types.ObjectId;
    noOfSeats: number;
    travellerDetails: TravellerDetails[];
 date: Date;
    code: string;
    amount: number;
    paymentId: mongoose.Types.ObjectId;
    status: BookingStatus;
    cancellation?: CancellationDetails;
    isDeleted: boolean;
    DeletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateBookingJobData {
    requestId: string;
    bookingData: {
        invoiceNumber: string;
        userId: string;
        tourId: string;
        noOfSeats: number;
        date: Date;
        code: string;
        travellerDetails: TravellerDetails;
        amount: number;
        paymentId: string;
    };
}

export interface UpdateBookingStatusJobData {
    requestId: string;
    bookingId: string;
    status: BookingStatus;
}

export interface CancelBookingJobData {
    userId:mongoose.Types.ObjectId;
    requestId: string;
    bookingId: string;
    cancelledBy: string;
    reason?: string;
    description?: string;
    refundAmount?: number;
    refundStatus?: RefundStatus;
}

export interface DeleteBookingJobData {
    requestId: string;
    bookingId: string;
}
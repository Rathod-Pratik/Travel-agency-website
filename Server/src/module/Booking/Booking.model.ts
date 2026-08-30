import mongoose, { type HydratedDocument } from "mongoose";
import type { IBooking } from "./Booking.types";

const bookingSchema = new mongoose.Schema<IBooking>(
    {
        code: {
            type: String,
            required: [true, "Booking code is required"],
            unique: true,
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },

        tourId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tour",
            required: [true, "Tour ID is required"],
        },

        noOfSeats: {
            type: Number,
            required: [true, "Number of seats is required"],
            min: [1, "Number of seats must be at least 1"]
        },
        travellerDetails: [{
            name: {
                type: String,
                required: [true, "Traveller name is required"],
                trim: true,
            },

            age: {
                type: Number,
                required: [true, "Traveller age is required"],
                min: [1, "Age must be at least 1"],
            },

            document: {
                type: String,
                required: [true, "Traveller document is required"],
                trim: true,
            },
        }],

        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0, "Amount cannot be negative"],
        },

        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Payment ID is required"],
            trim: true,
            ref: "Payment",
        },
        invoiceNumber:{
            type: String,
            required: [true, "Booking code is required"],
            unique: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["Booked", "Cancelled", "Pending"],
            default: "Pending",
        },
        cancellation: {
            reason: String,
            description: String,
            cancelledBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Auth"
            },
            cancelledAt: Date,
            refundAmount: Number,
            refundStatus: {
                type: String,
                enum: ["NOT_APPLICABLE", "PENDING", "PROCESSING", "REFUNDED", "FAILED"]
            }
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }, DeletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export type BookingDocument = HydratedDocument<IBooking>;

const BookingModel = mongoose.model<IBooking>("Booking", bookingSchema);

export default BookingModel;
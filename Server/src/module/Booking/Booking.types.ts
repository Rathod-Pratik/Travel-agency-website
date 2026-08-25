import mongoose from "mongoose";

export interface ITravellerDetails {
  name: string;
  age: number;
  document: string;
  documentType:string;
}

export interface IBooking {
  code: string;
  userId: mongoose.Types.ObjectId;
  tourId: mongoose.Types.ObjectId;
  travellerDetails: ITravellerDetails[];
  date: Date;
  amount: number;
  noOfSeats: number;
  paymentId: mongoose.Types.ObjectId;
  status: "Booked" | "Cancelled" | "Pending";
  cancellation?: {
    reason: string;
    cancelledAt: Date;
    description: string;
    cancelledBy: mongoose.Types.ObjectId;
    refundAmount: number;
    refundStatus: "PENDING" | "REFUNDED" | "FAILED";
  };
  isDeleted?: boolean;
  DeletedAt?: Date;
}
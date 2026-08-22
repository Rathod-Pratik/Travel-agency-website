import mongoose from "mongoose";

export interface ITravellerDetails {
  name: string;
  age: number;
  document: string;
  documentType:string;
}

export interface IBooking {
  userId: mongoose.Types.ObjectId;
  tourId: mongoose.Types.ObjectId;
  travellerDetails: ITravellerDetails[];
  date: Date;
  amount: number;
  paymentId: string;
  status: "Booked" | "Cancelled" | "Pending";
  cancellation?: {
    reason: string;
    cancelledAt: Date;
    description: string;
    cancelledBy: mongoose.Types.ObjectId;
    refundAmount: number;
    refundStatus: "PENDING" | "REFUNDED" | "FAILED";
  };
}
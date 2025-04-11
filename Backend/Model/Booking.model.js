import { json } from "express";
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPhone: {
    type: String,
    required: true,
  },
  tourData: {
    type: Object,
    required: true,
  },
  tourDate: {
    type: Date,
    required: true,
  },
  tourPrice: {
    type: Number,
    required: true,
  },
  numberOfPeople: {
    type: Number,
    required: true,
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  bookingStatus: {
    type: String,
    default: "success",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  BookedBy:{
    type:String,
    required:true
  }
});

const BookingModel = mongoose.model("Booking", bookingSchema);
export default BookingModel;

import mongoose from "mongoose";

export interface IReview {
    userId: mongoose.Schema.Types.ObjectId;
    TourId: mongoose.Schema.Types.ObjectId;
    rating: number;
    reviewText: string;
    createdAt: Date;
}
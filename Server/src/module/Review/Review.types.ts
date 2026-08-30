import mongoose from "mongoose";

export interface IReview {
    requestId: string;
    userId: mongoose.Schema.Types.ObjectId;
    TourId: mongoose.Schema.Types.ObjectId;
    rating: number;
    reviewText: string;
    createdAt: Date;
}
export interface CreateReviewJobData {
    requestId: string;
    userId: string;
    TourId: string;
    rating: number;
    reviewText: string;
}

export interface UpdateReviewJobData {
    requestId: string;
    id: string;
    userId: string;
    TourId: string;
    rating: number;
    reviewText: string;
}

export interface DeleteReviewJobData{
    id: string;
    requestId: string;
    userId: string;
}

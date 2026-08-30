import mongoose from "mongoose";
import { IReview } from "./Review.types";

const reviewSchema = new mongoose.Schema<IReview>({
    requestId:{
        type: String,
        required: [true, 'Request ID is required']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    TourId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Tour ID is required']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        required: [true, 'Review text is required'],
        trim: true
    }
},{
    timestamps: true
});

export type ReviewDocument = mongoose.HydratedDocument<IReview>;

const ReviewModel = mongoose.model<IReview>('Review', reviewSchema);

export default ReviewModel;

import mongoose from "mongoose";

export interface IWishlist {
    userId: mongoose.Schema.Types.ObjectId;
    tourId: mongoose.Schema.Types.ObjectId;
    requestId:string
}

export interface AddWishlistJobData {
    userId: string;
    tourId: string;
    requestId: string;
}

export interface RemoveWishlistJobData {
    userId: string;
    tourId: string;
    requestId: string;
}
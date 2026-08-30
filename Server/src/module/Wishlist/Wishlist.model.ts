import mongoose from "mongoose";
import { IWishlist } from "./Wishlist.types";

const WishlistSchema = new mongoose.Schema<IWishlist>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true
        },

        tourId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tour"
        },
        requestId: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export const WishlistModel = mongoose.model<IWishlist>(
    "Wishlist",
    WishlistSchema
);
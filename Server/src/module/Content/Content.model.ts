import mongoose, { Document, Schema } from "mongoose";
import { IContent } from "./Content.types";

const ContentSchema = new Schema<IContent>(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        type: {
            type: String,
            enum: [
                "terms",
                "privacy",
                "about",
                "help",
                "contact",
                "cookie-policy",
                "travel-policy",
                "payment-policy",
                "booking-policy"
            ],
            required: true,
            unique: true
        },

        content: {
            type: [String],
            required: true
        },
requestId: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export const ContentModel = mongoose.model<IContent>(
    "Content",
    ContentSchema
);
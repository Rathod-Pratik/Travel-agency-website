import { Schema, model } from "mongoose";
import { ICoupan } from "./Coupan.types";

const CoupanSchema = new Schema<ICoupan>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        discount: {
            type: Number,
            required: true,
            min: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },

        expiryDate: {
            type: Date,
            required: true,
            expires: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const CoupanModel =
    model<ICoupan>("Coupan", CoupanSchema);
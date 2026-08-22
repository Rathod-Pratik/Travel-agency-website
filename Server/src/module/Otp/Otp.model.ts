import mongoose from "mongoose";
import { IOtp } from "./Otp.types";

const OtpSchema = new mongoose.Schema<IOtp>(
    {
        otp:{
            type: String,
            required: [true, 'OTP is required'],
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, 'User ID is required']
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 300, // Delete after 5 minutes
        },
    }
)

export type OtpDocument = mongoose.HydratedDocument<IOtp>;

export const OtpModel = mongoose.model<IOtp>("Otp", OtpSchema)
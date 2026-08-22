import mongoose from "mongoose";

export interface IOtp {
    otp: string;
    userId: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
}
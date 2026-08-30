import mongoose from "mongoose";

export interface ICoupan {
    name: string;
    description: string;
    code: string;
    discount: number;
    isActive: boolean;
    expiryDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCoupanJobData {
    requestId: string;
    userId: mongoose.Types.ObjectId;
    coupanData: {
        name: string;
        description: string;
        code: string;
        discount: number;
        isActive?: boolean;
        expiryDate: Date;
    };
}

export interface UpdateCoupanJobData {
    requestId: string;
    userId: mongoose.Types.ObjectId;
    id: string;
    coupanData: {
        name?: string;
        description?: string;
        code?: string;
        discount?: number;
        isActive?: boolean;
        expiryDate?: Date;
    };
}

export interface DeleteCoupanJobData {
    requestId: string;
    userId: mongoose.Types.ObjectId;
    id: string;
}
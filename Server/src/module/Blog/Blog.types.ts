import mongoose from "mongoose";

export interface IBlog {
    title: string;
    image: string[];
    description: string[];
    isDeleted?: boolean;
    DeletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateBlogJobData {
    requestId: string;
    blogData: {
        title: string;
        description: string[];
    };
    imagekeys: string[];
    userId: mongoose.Schema.Types.ObjectId;
}

export interface UpdateBlogJobData {
    requestId: string;
    id: string;
    blogData: {
        title: string;
        description: string[];
    };
    imagekeys?: string[];
     userId: mongoose.Schema.Types.ObjectId;
}

export interface DeleteBlogJobData {
    requestId: string;
    id: string;
     userId: mongoose.Schema.Types.ObjectId;
}
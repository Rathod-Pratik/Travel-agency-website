import mongoose from "mongoose";

export type ContentType =
    | "terms"
    | "privacy"
    | "about"
    | "help"
    | "contact"
    | "cookie-policy"
    | "travel-policy"
    | "payment-policy"
    | "booking-policy";


export interface IContent {
    requestId: string;
    title: string;
    slug: string;
    type: ContentType;
    content: string[];
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface CreateContentJobData {
    userId: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    type: ContentType;
    content: string;
    isActive?: boolean;
    requestId: string;
}


export interface UpdateContentJobData {
    userId: mongoose.Types.ObjectId;
    id: string;
    title?: string;
    slug?: string;
    type?: ContentType;
    content?: string;
    isActive?: boolean;
    requestId: string;
}
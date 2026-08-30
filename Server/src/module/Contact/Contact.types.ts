import mongoose from "mongoose";

export interface IContact {
    name: string,
    email: string,
    mobile: string,
    message: string,
    requestId: string,
    userid: mongoose.Types.ObjectId,
    isDeleted?: boolean,
    DeletedAt?: Date
}
export interface CreateContactJobData {
    name: string,
    email: string,
    mobile: string,
    message: string,
    requestId: string,
    userid: mongoose.Types.ObjectId,
    isDeleted?: boolean,
    DeletedAt?: Date
}
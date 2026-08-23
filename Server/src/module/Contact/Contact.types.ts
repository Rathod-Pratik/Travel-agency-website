import mongoose from "mongoose";

export interface IContact {
    name: string,
    email: string,
    mobile: string,
    message: string,
    userid: mongoose.Schema.Types.ObjectId,
    isDeleted?: boolean,
    DeletedAt?: Date
}
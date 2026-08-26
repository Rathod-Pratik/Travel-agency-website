import mongoose, { HydratedDocument } from "mongoose";
import { IAuth } from "./Auth.types";

const AuthSchema = new mongoose.Schema<IAuth>({
    image: {
        type: String,
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Phone Number is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    address: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    DeletedAt: {
        type: Date,
        default: null
    }
},
    {
        timestamps: true
    })

export type AuthDocument = HydratedDocument<IAuth>;

export const AuthModel = mongoose.model<IAuth>("Auth", AuthSchema)
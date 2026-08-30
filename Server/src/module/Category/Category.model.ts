import mongoose, { HydratedDocument } from "mongoose";
import { ICategory } from "./Category.types";

const CategorySchema = new mongoose.Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            maxlength: 100
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        icon: {
            type: String,
            trim: true
        },
        isHomePage: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        requestId:{
            type: String,
            required: true
        },
        DeletedAt: {
            type: Date,
            default: null
        }
    }, { timestamps: true });

export type CategoryDocument =
    HydratedDocument<ICategory>;

export const CategoryModel = mongoose.model<ICategory>("Category", CategorySchema);
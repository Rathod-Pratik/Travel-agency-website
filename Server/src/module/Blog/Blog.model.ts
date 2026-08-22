import mongoose, { type HydratedDocument } from "mongoose";
import type { IBlog } from "./Booking.types";

const blogSchema = new mongoose.Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
    },

    description: {
      type: [String],
      required: [true, "Description is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export type BlogDocument = HydratedDocument<IBlog>;

export const BlogModel = mongoose.model<IBlog>("Blog", blogSchema);
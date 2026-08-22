import mongoose, { HydratedDocument } from "mongoose";
import { ITour } from "./Tour.types";

const TourSchema = new mongoose.Schema<ITour>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 150
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
      required: [true, "Description is required"],
      trim: true
    },

    destination: {
      country: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      }
    },

    duration: {
      days: {
        type: Number,
        required: true,
        min: 1
      },
      nights: {
        type: Number,
        required: true,
        min: 0
      }
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0
    },

    discountPrice: {
      type: Number,
      min: 0
    },

    currency: {
      type: String,
      default: "INR"
    },

    images: {
      type: [String],
      required: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Adventure",
        "Beach",
        "Family",
        "Honeymoon",
        "Luxury",
        "Pilgrimage",
        "Wildlife",
        "Cultural"
      ]
    },

    included: {
      type: [String],
      default: []
    },

    notIncluded: {
      type: [String],
      default: []
    },

    itinerary: [
      {
        day: {
          type: Number,
          required: true
        },
        title: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        activities: {
          type: [String],
          default: []
        }
      }
    ],

    maxSeats: {
      type: Number,
      required: true,
      min: 1
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    totalReviews: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["draft", "active", "inactive", "completed","Cancelled"],
      default: "draft"
    },

    featured: {
      type: Boolean,
      default: false
    },

    startDate: {
      type: Date
    },

    endDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export type TourDocument = HydratedDocument<ITour>;

export const TourModel = mongoose.model<ITour>(
  "Tour",
  TourSchema
);
import mongoose, { HydratedDocument } from "mongoose";
import { IHotel } from "./Hotel.types";

const HotelSchema = new mongoose.Schema<IHotel>(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    image: {
      type: [String],
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },

    roomType: {
      type: String,
      required: true,
      trim: true
    },

    meal: {
      breakfast: {
        type: Boolean,
        default: false
      },

      lunch: {
        type: Boolean,
        default: false
      },

      dinner: {
        type: Boolean,
        default: false
      }
    },

    pricePerPerson: {
      type: Number,
      required: true,
      min: 0
    },

    availableRooms: {
      type: Number,
      required: true,
      min: 0
    },
    amenities: {
      type: [String],
      default: []
    },
    isActive: {
      type: String,
      default: "active",
      enum: ["active", "inactive", "draft"]
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
  }
);

export type HotelDocument =
  HydratedDocument<IHotel>;

export const HotelModel =
  mongoose.model<IHotel>(
    "Hotel",
    HotelSchema
  );
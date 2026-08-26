import mongoose, { HydratedDocument } from "mongoose";
import { IHotel } from "./Hotel.types";

const HotelSchema = new mongoose.Schema<IHotel>(
  {
    image:{
        type: [String],
    },
      name: {
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
        enum: ["Single", "Double"],
        trim: true
      },

    meal: {
      name: {
        type: String,
        required: true,
        trim: true
      },

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

    isActive: {
      type: Boolean,
      default: true
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
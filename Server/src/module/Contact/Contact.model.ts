import mongoose,{type HydratedDocument} from "mongoose";
import type { IContact } from "./Contact.types";

const ContactSchema = new mongoose.Schema<IContact>(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
    }
  },
  {
    timestamps: true,
  }
);

export type ContactDocument = HydratedDocument<IContact>;

export const ContactModel = mongoose.model<IContact>("Contact", ContactSchema);
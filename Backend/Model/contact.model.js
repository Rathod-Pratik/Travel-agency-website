import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    mobile_no: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      minlength: [5, "Message must be at least 5 characters long"],
    },
    userData:{
      type:Object,
      required:true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 30, // 30 days in seconds
    }
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

const ContactModel = mongoose.model("Contact", ContactSchema);
export default ContactModel;

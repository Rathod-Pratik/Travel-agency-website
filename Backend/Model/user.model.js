import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    address:{
      type:String,
      default:null
    },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    otpType: { type: String, enum: ["login", "forgotPassword"], default: null },
    createdAt: { type: Date, default: Date.now },
  },
 
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
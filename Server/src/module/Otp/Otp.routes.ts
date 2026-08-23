import express from "express";
import { GetOtp, VerifyOtp } from "./Otp.controller";
import { Validate } from "@middleware/Validation.middleware";
import { OtpSchema, OtpVerifySchema } from "./Otp.validation";

const Route = express.Router();

Route.get("/",Validate(OtpSchema),GetOtp);
Route.post("/verify", Validate(OtpVerifySchema),VerifyOtp);

export default Route;
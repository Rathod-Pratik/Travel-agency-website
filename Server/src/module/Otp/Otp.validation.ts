import {z} from "zod";

export const OtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export const OtpVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});
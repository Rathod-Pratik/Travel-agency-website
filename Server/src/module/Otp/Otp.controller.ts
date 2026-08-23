import { getCache, OtpCacheKeys, setCache } from "@utils/index";
import { Request, Response } from "express";
export const GetOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        setCache(OtpCacheKeys.detailsVersion(email), otp, 5 * 60); // Cache for 5 minutes
        res.status(200).json({ message: "OTP generated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error generating OTP" });
    }
}
export const VerifyOtp = async (req: Request, res: Response) => {
    try {
const { email, otp } = req.body;
        const cachedOtp = await getCache(OtpCacheKeys.detailsVersion(email));
        if (cachedOtp === otp) {
            res.status(200).json({ message: "OTP verified successfully" });
        } else {
            res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error verifying OTP" });
    }
}
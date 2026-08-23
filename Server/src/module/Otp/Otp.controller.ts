import { getCache, OtpCacheKeys, setCache } from "@utils/index";
import { Request, Response } from "express";
import { logger } from "@modules/log/logger";

export const GetOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        setCache(
            OtpCacheKeys.detailsVersion(email),
            otp,
            5 * 60
        );

        logger.info("OTP generated successfully", {
            metadata: {
                email
            }
        });

        res.status(200).json({
            message: "OTP generated successfully"
        });

    } catch (error) {

        logger.error("Error generating OTP", {
            metadata: {
                email: req.body.email,
                error: error instanceof Error
                    ? error.message
                    : String(error)
            }
        });

        res.status(500).json({
            message: "Error generating OTP"
        });
    }
};

export const VerifyOtp = async (req: Request, res: Response) => {
    try {

        const { email, otp } = req.body;

        const cachedOtp = await getCache(
            OtpCacheKeys.detailsVersion(email)
        );

        if (cachedOtp === otp) {

            logger.info("OTP verified successfully", {
                metadata: {
                    email
                }
            });

            res.status(200).json({
                message: "OTP verified successfully"
            });

        } else {

            logger.warn("OTP verification failed", {
                metadata: {
                    email
                }
            });

            res.status(400).json({
                message: "Invalid OTP"
            });
        }

    } catch (error) {

        logger.error("Error verifying OTP", {
            metadata: {
                email: req.body.email,
                error: error instanceof Error
                    ? error.message
                    : String(error)
            }
        });

        res.status(500).json({
            message: "Error verifying OTP"
        });
    }
};
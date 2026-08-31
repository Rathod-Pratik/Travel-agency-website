import nodemailer from "nodemailer";
import { logger } from "@modules/log/logger";
import dotenv from "dotenv";

dotenv.config();

const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER || process.env.EMAIL;
const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;
const emailHost = process.env.EMAIL_HOST || process.env.SMTP_HOST;
const emailPort = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : undefined;
const emailFrom = process.env.EMAIL_FROM || emailUser || "TravelWorld <no-reply@travelworld.com>";

export const transporter = nodemailer.createTransport(
    emailHost
        ? {
              host: emailHost,
              port: emailPort || 587,
              secure: emailPort === 465,
              auth: {
                  user: emailUser,
                  pass: emailPass,
              },
          }
        : {
              service: process.env.EMAIL_SERVICE || "gmail",
              auth: {
                  user: emailUser,
                  pass: emailPass,
              },
          }
);

export interface MailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

export const sendMail = async ({ to, subject, html, from }: MailOptions) => {
    try {
        const info = await transporter.sendMail({
            from: from || emailFrom,
            to,
            subject,
            html,
        });

        logger.info("Mail sent successfully", {
            metadata: {
                messageId: info.messageId,
                to,
                subject,
            },
        });

        return info;
    } catch (error) {
        logger.error("Failed to send mail", {
            metadata: {
                to,
                subject,
                error: error instanceof Error ? error.message : String(error),
            },
        });
        throw error;
    }
};

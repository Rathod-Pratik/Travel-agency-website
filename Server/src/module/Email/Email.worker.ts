import { Worker } from "bullmq";
import { bellmqConnection } from "@config/redis";
import { SendEmailJobData } from "./Email.types";
import {
    sendWelcomeEmail,
    sendOtpEmail,
    sendPasswordResetEmail,
    sendBookingConfirmedEmail,
    bookingCancelledByUserEmail,
    bookingCancelledByAdminEmail,
    paymentSuccessEmail,
    RefundProcessedEmail,
    bookingReminderEmail,
} from "./templates/index";
import { sendMail } from "@utils/mailer";
import { logger } from "@modules/log/logger";

export const emailWorker = new Worker<SendEmailJobData>(
    "email",
    async (job) => {
        const { requestId, email, type } = job.data;

        logger.info("Email Worker: Processing email job", {
            metadata: {
                jobId: job.id,
                requestId,
                email,
                type,
            },
        });

        let html = "";
        let subject = "";

        switch (job.data.type) {
            case "welcome": {
                html = sendWelcomeEmail(job.data.data);
                subject = "Welcome to TravelWorld";
                break;
            }

            case "otp": {
                html = sendOtpEmail(job.data.data);
                subject = "Your TravelWorld OTP";
                break;
            }

            case "password-reset": {
                html = sendPasswordResetEmail(job.data.data);
                subject = "Reset Your TravelWorld Password";
                break;
            }

            case "booking-confirmed": {
                html = sendBookingConfirmedEmail(job.data.data);
                subject = "Booking Confirmed - TravelWorld";
                break;
            }

            case "booking-cancelled-user": {
                html = bookingCancelledByUserEmail(job.data.data);
                subject = "Booking Cancelled - TravelWorld";
                break;
            }

            case "booking-cancelled-admin": {
                html = bookingCancelledByAdminEmail(job.data.data);
                subject = "Booking Cancelled by TravelWorld";
                break;
            }

            case "payment-success": {
                html = paymentSuccessEmail(job.data.data);
                subject = "Payment Successful - TravelWorld";
                break;
            }

            case "refund-processed": {
                html = RefundProcessedEmail(job.data.data);
                subject = "Refund Processing - TravelWorld";
                break;
            }

            case "booking-reminder": {
                html = bookingReminderEmail(job.data.data);
                subject = "Your Trip Is Coming Up - TravelWorld";
                break;
            }

            default: {
                throw new Error(`Unsupported email type: ${type}`);
            }
        }

        await sendMail({
            to: email,
            subject,
            html,
        });

        logger.info("Email Worker: Email sent successfully", {
            metadata: {
                jobId: job.id,
                requestId,
                email,
                type,
            },
        });

        return {
            success: true,
            email,
            type,
            requestId,
        };
    },
    {
        connection: bellmqConnection,
        concurrency: 5,
    }
);

emailWorker.on("completed", (job) => {
    logger.info("Email Worker: Job completed", {
        metadata: {
            jobId: job.id,
            jobName: job.name,
        },
    });
});

emailWorker.on("failed", (job, error) => {
    logger.error("Email Worker: Job failed", {
        metadata: {
            jobId: job?.id,
            jobName: job?.name,
            error: error.message,
        },
    });
});
import { Worker } from "bullmq";
import { bellmqConnection } from "@config/redis";

import {
    SendEmailJobData
} from "./Email.types";

import {
    sendBookingConfirmedEmail,
    sendBookingCancelledEmail,
    sendPaymentSuccessEmail,
    sendPaymentFailedEmail,
    sendOtpEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail,
    sendLoginEmail,
} from "./Email.templates";

import { logger } from "@modules/log/logger";


export const emailWorker =
    new Worker<SendEmailJobData>(
        "email",

        async (job) => {

            const {
                requestId,
                email,
                type,
                data
            } = job.data;

            logger.info(
                "Email Worker: Processing email job",
                {
                    metadata: {
                        jobId: job.id,
                        requestId,
                        email,
                        type
                    }
                }
            );

            switch (type) {

                case "booking-confirmed": {

                    await sendBookingConfirmedEmail(
                        email,
                        data
                    );

                    break;
                }

                case "booking-cancelled": {

                    await sendBookingCancelledEmail(
                        email,
                        data
                    );

                    break;
                }

                case "payment-success": {

                    await sendPaymentSuccessEmail(
                        email,
                        data
                    );

                    break;
                }

                case "payment-failed": {

                    await sendPaymentFailedEmail(
                        email,
                        data
                    );

                    break;
                }

                case "otp": {

                    await sendOtpEmail(
                        email,
                        data
                    );

                    break;
                }

                case "password-reset": {

                    await sendPasswordResetEmail(
                        email,
                        data
                    );

                    break;
                }

                case "welcome": {

                    await sendWelcomeEmail(
                        email,
                        data
                    );

                    break;
                }

                default: {

                    throw new Error(
                        `Unsupported email type: ${type}`
                    );
                }
            }

            logger.info(
                "Email Worker: Email sent successfully",
                {
                    metadata: {
                        jobId: job.id,
                        requestId,
                        email,
                        type
                    }
                }
            );

            return {
                success: true,
                email,
                type,
                requestId
            };
        },

        {
            connection: bellmqConnection,
            concurrency: 5
        }
    );


emailWorker.on(
    "completed",
    (job) => {

        logger.info(
            "Email Worker: Job completed",
            {
                metadata: {
                    jobId: job.id,
                    jobName: job.name
                }
            }
        );
    }
);


emailWorker.on(
    "failed",
    (job, error) => {

        logger.error(
            "Email Worker: Job failed",
            {
                metadata: {
                    jobId: job?.id,
                    jobName: job?.name,
                    error: error.message
                }
            }
        );
    }
);
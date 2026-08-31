import crypto from "crypto";
import { emailQueue } from "./Email.queue";
import { SendEmailJobData } from "./Email.types";
import { logger } from "@modules/log/logger";

export const sendEmail = async (jobData: SendEmailJobData) => {
    const requestId = jobData.requestId || crypto.randomUUID();
    const payload = { ...jobData, requestId };

    try {
        const job = await emailQueue.add(jobData.type, payload, {
            attempts: 5,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
            removeOnComplete: {
                age: 3600,
            },
            removeOnFail: {
                age: 86400,
            },
        });

        logger.info("Email job added to queue", {
            metadata: {
                jobId: job.id,
                requestId,
                email: jobData.email,
                type: jobData.type,
            },
        });

        return {
            success: true,
            jobId: job.id,
            requestId,
        };
    } catch (error) {
        logger.error("Error adding email job to queue", {
            metadata: {
                requestId,
                email: jobData.email,
                type: jobData.type,
                error: error instanceof Error ? error.message : String(error),
            },
        });
        throw error;
    }
};

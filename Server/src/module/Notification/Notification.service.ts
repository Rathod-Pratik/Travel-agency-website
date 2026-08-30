import crypto from "crypto";

import { notificationCreationQueue } from "./Notification.queue";
import {
    NotificationType
} from "./Notification.types";

import { logger } from "@modules/log/logger";
import mongoose from "mongoose";

interface CreateNotificationParams {
    userId: mongoose.Types.ObjectId;
    message: string;
    type: NotificationType;
}

export const createNotification = async ({
    userId,
    message,
    type
}: CreateNotificationParams) => {

    const requestId =
        crypto.randomUUID();

    try {

        const job =
            await notificationCreationQueue.add(
                "notification-creation",
                {
                    requestId,

                    notificationData: {
                        userId,
                        message,
                        type
                    }
                },
                {
                    attempts: 5,

                    backoff: {
                        type: "exponential",
                        delay: 5000
                    },

                    removeOnComplete: {
                        age: 3600
                    },

                    removeOnFail: {
                        age: 86400
                    }
                }
            );

        logger.info(
            "Notification creation job added to queue",
            {
                metadata: {
                    userId,
                    requestId,
                    jobId: job.id
                }
            }
        );

        return {
            success: true,
            jobId: job.id,
            requestId
        };

    } catch (error) {

        logger.error(
            "Error adding notification creation job",
            {
                metadata: {
                    userId,
                    requestId,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );

        throw error;
    }
};
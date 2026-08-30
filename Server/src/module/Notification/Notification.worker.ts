import { Worker } from "bullmq";
import { bellmqConnection } from "@config/redis";

import { NotificationModel } from "./Notification.model";

import {
    CreateNotificationJobData,
    ReadNotificationJobData,
    DeleteNotificationJobData
} from "./Notification.types";

import {
    NotificationCacheKeys,
    incrementCacheVersion
} from "@utils/index";

import { logger } from "@modules/log/logger";


export const notificationCreateWorker =
    new Worker<CreateNotificationJobData>(
        "notification-creation",

        async (job) => {

            const {
                requestId,
                notificationData
            } = job.data;

            logger.info(
                "Notification Worker: Processing notification creation job",
                {
                    metadata: {
                        requestId,
                        notificationData
                    }
                }
            );

            const existingNotification =
                await NotificationModel.findOne({
                    requestId
                });

            if (existingNotification) {

                logger.info(
                    "Notification Worker: Notification already exists",
                    {
                        metadata: {
                            requestId,
                            notificationId:
                                existingNotification._id
                        }
                    }
                );

                return {
                    notificationId:
                        existingNotification._id,
                    alreadyCreated: true
                };
            }

            const notification =
                await NotificationModel.create({
                    ...notificationData,
                    requestId
                });

            await incrementCacheVersion(
                NotificationCacheKeys.listVersion()
            );

            logger.info(
                "Notification Worker: Notification created successfully",
                {
                    metadata: {
                        requestId,
                        notificationId:
                            notification._id,
                        userId:
                            notification.userId
                    }
                }
            );

            return {
                notificationId: notification._id,
                alreadyCreated: false
            };
        },
        {
            connection: bellmqConnection,
            concurrency: 5
        }
    );


export const notificationReadWorker =
    new Worker<ReadNotificationJobData>(
        "notification-read",

        async (job) => {

            const {
                id,
                requestId
            } = job.data;

            logger.info(
                "Notification Worker: Processing notification read job",
                {
                    metadata: {
                        requestId,
                        notificationId: id
                    }
                }
            );

            const notification =
                await NotificationModel.findOneAndUpdate(
                    {
                        _id: id,
                        isDeleted: false
                    },
                    {
                        $set: {
                            read: true
                        }
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                ).lean();

            if (!notification) {

                logger.warn(
                    "Notification read failed - notification not found",
                    {
                        metadata: {
                            requestId,
                            notificationId: id
                        }
                    }
                );

                return {
                    notificationId: id,
                    read: false
                };
            }

            await incrementCacheVersion(
                NotificationCacheKeys.listVersion()
            );

            await incrementCacheVersion(
                NotificationCacheKeys.detailsVersion(id)
            );

            logger.info(
                "Notification Worker: Notification marked as read",
                {
                    metadata: {
                        requestId,
                        notificationId: id,
                        userId: notification.userId
                    }
                }
            );

            return {
                notificationId: id,
                read: true
            };
        },
        {
            connection: bellmqConnection,
            concurrency: 5
        }
    );


export const notificationDeleteWorker =
    new Worker<DeleteNotificationJobData>(
        "notification-delete",

        async (job) => {

            const {
                id,
                requestId
            } = job.data;

            logger.info(
                "Notification Worker: Processing notification delete job",
                {
                    metadata: {
                        requestId,
                        notificationId: id
                    }
                }
            );

            const existingNotification =
                await NotificationModel.findById(id);

            if (!existingNotification) {

                logger.warn(
                    "Notification delete failed - notification not found",
                    {
                        metadata: {
                            requestId,
                            notificationId: id
                        }
                    }
                );

                return;
            }

            if (existingNotification.isDeleted) {

                logger.warn(
                    "Notification delete failed - notification already deleted",
                    {
                        metadata: {
                            requestId,
                            notificationId: id
                        }
                    }
                );

                return;
            }

            const notification =
                await NotificationModel.findByIdAndUpdate(
                    id,
                    {
                        $set: {
                            isDeleted: true,
                            DeletedAt: new Date()
                        }
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                ).lean();

            if (!notification) {

                logger.error(
                    "Notification Worker: Notification delete failed",
                    {
                        metadata: {
                            requestId,
                            notificationId: id
                        }
                    }
                );

                return {
                    notificationId: id,
                    deleted: false
                };
            }

            await incrementCacheVersion(
                NotificationCacheKeys.listVersion()
            );

            await incrementCacheVersion(
                NotificationCacheKeys.detailsVersion(id)
            );

            logger.info(
                "Notification Worker: Notification deleted successfully",
                {
                    metadata: {
                        requestId,
                        notificationId: id,
                        userId: notification.userId
                    }
                }
            );

            return {
                notificationId: id,
                deleted: true
            };
        },
        {
            connection: bellmqConnection,
            concurrency: 5
        }
    );
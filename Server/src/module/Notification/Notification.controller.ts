import { Request, Response } from "express";
import crypto from "crypto";

import { NotificationModel } from "./Notification.model";

import {
    notificationCreationQueue,
    notificationReadQueue,
    notificationDeleteQueue
} from "./Notification.queue";

import {
    NotificationCacheKeys,
    getCache,
    getCacheVersion,
    setCache
} from "@utils/index";

import { logger } from "@modules/log/logger";

export const GetNotifications = async (
    req: Request,
    res: Response
) => {

    const userId =
        (req as any).user._id;

    try {

        let page =
            Number(req.query.page) || 1;

        let limit =
            Number(req.query.limit) || 10;

        if (page < 1) {
            page = 1;
        }

        if (limit < 1) {
            limit = 10;
        }

        if (limit > 100) {
            limit = 100;
        }

        const version =
            await getCacheVersion(
                NotificationCacheKeys.listVersion()
            );

        const cacheKey =
            NotificationCacheKeys.list(
                version,
                page,
                limit,
                userId.toString()
            );

        const cachedNotifications =
            await getCache(cacheKey);

        if (cachedNotifications) {

            logger.info(
                "Notifications fetched from Redis",
                {
                    metadata: {
                        userId,
                        page,
                        limit,
                        source: "redis"
                    }
                }
            );

            return res.status(200).json({
                success: true,
                source: "redis",
                data: cachedNotifications
            });
        }

        const notifications =
            await NotificationModel
                .find({
                    userId,
                    isDeleted: false
                })
                .sort({
                    createdAt: -1
                })
                .skip(
                    (page - 1) * limit
                )
                .limit(limit)
                .lean();

        if (
            !notifications ||
            notifications.length === 0
        ) {

            return res.status(200).json({
                success: true,
                message: "No notifications found",
                source: "mongodb",
                data: []
            });
        }

        await setCache(
            cacheKey,
            notifications,
            300
        );

        logger.info(
            "Notifications fetched from MongoDB",
            {
                metadata: {
                    userId,
                    count: notifications.length,
                    page,
                    limit,
                    source: "mongodb"
                }
            }
        );

        return res.status(200).json({
            success: true,
            source: "mongodb",
            data: notifications
        });

    } catch (error) {

        logger.error(
            "Error fetching notifications",
            {
                metadata: {
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );

        return res.status(500).json({
            success: false,
            message: "Error fetching notifications"
        });
    }
};

export const GetNotificationDetails = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params as { id: string };

    try {

        const version =
            await getCacheVersion(
                NotificationCacheKeys.detailsVersion(id)
            );

        const cacheKey =
            NotificationCacheKeys.details(
                id,
                version
            );

        const cachedNotification =
            await getCache(cacheKey);

        if (cachedNotification) {

            return res.status(200).json({
                success: true,
                source: "redis",
                data: cachedNotification
            });
        }

        const notification =
            await NotificationModel
                .findOne({
                    _id: id,
                    isDeleted: false
                })
                .lean();

        if (!notification) {

            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        await setCache(
            cacheKey,
            notification,
            300
        );

        return res.status(200).json({
            success: true,
            source: "mongodb",
            data: notification
        });

    } catch (error) {

        logger.error(
            "Error fetching notification details",
            {
                metadata: {
                    notificationId: id,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );

        return res.status(500).json({
            success: false,
            message: "Error fetching notification"
        });
    }
};

export const MarkNotificationRead = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params as { id: string };

    const requestId =
        crypto.randomUUID();

    try {

        const job =
            await notificationReadQueue.add(
                "notification-read",
                {
                    id,
                    requestId
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

        return res.status(202).json({
            success: true,
            message: "Notification read status is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (error) {

        logger.error(
            "Error marking notification as read",
            {
                metadata: {
                    notificationId: id,
                    requestId,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );

        return res.status(500).json({
            success: false,
            message: "Error marking notification as read"
        });
    }
};

export const DeleteNotification = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params as { id: string };

    const requestId =
        crypto.randomUUID();

    try {

        const existingNotification =
            await NotificationModel.findById(id);

        if (!existingNotification) {

            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        if (existingNotification.isDeleted) {

            return res.status(400).json({
                success: false,
                message: "Notification is already deleted"
            });
        }

        const job =
            await notificationDeleteQueue.add(
                "notification-delete",
                {
                    id,
                    requestId
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

        return res.status(202).json({
            success: true,
            message: "Notification deletion is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (error) {

        logger.error(
            "Error deleting notification",
            {
                metadata: {
                    notificationId: id,
                    requestId,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );

        return res.status(500).json({
            success: false,
            message: "Error deleting notification"
        });
    }
};
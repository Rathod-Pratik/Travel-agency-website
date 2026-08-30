import {
    Request,
    Response
} from "express";

import crypto from "crypto";

import { CoupanModel } from "./Coupan.model";

import {
    coupanCreationQueue,
    coupanUpdateQueue,
    coupanDeleteQueue
} from "./Coupan.queue";

import {
    getCache,
    setCache,
    getCacheVersion
} from "@utils/index";

import {
    CoupanCacheKeys
} from "@utils/cache/cacheKeys";

import { logger } from "@modules/log/logger";

import {
    createNotification
} from "@modules/Notification/Notification.service";


export const CreateCoupan = async (
    req: Request,
    res: Response
) => {

    const {
        name,
        description,
        code,
        discount,
        isActive,
        expiryDate
    } = req.body;

    const requestId =
        crypto.randomUUID();

    const userId =
        (req as any).user._id.toString();

    try {

        const existingCoupan =
            await CoupanModel.findOne({
                code
            });

        if (existingCoupan) {

            return res.status(409).json({
                success: false,
                message:
                    "Coupon code already exists"
            });
        }

        const job =
            await coupanCreationQueue.add(
                "coupan-creation",
                {
                    requestId,
                    userId,
                    coupanData: {
                        name,
                        description,
                        code,
                        discount,
                        isActive,
                        expiryDate
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

        await createNotification({
            userId,
            message:
                `Coupon "${name}" has been queued for creation.`,
            type: "info"
        });

        logger.info(
            "Coupon creation job added to queue",
            {
                metadata: {
                    requestId,
                    jobId: job.id,
                    userId,
                    code
                }
            }
        );

        return res.status(202).json({
            success: true,
            message:
                "Coupon creation is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (error) {

        logger.error(
            "Error creating coupon",
            {
                metadata: {
                    requestId,
                    userId,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );
        await createNotification({
            userId,
            message: `Your request to create coupon "${name}" failed.`,
            type: "error"
        });
        return res.status(500).json({
            success: false,
            message:
                "Error creating coupon"
        });
    }
};


export const GetCoupans = async (
    req: Request,
    res: Response
) => {

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

    try {

        const version =
            await getCacheVersion(
                CoupanCacheKeys.listVersion()
            );

        const cacheKey =
            CoupanCacheKeys.list(
                version,
                page,
                limit
            );

        const cachedCoupans =
            await getCache(cacheKey);

        if (cachedCoupans) {

            return res.status(200).json({
                success: true,
                source: "redis",
                data: cachedCoupans
            });
        }

        const coupans =
            await CoupanModel
                .find()
                .sort({
                    createdAt: -1
                })
                .skip(
                    (page - 1) * limit
                )
                .limit(limit)
                .lean();

        const total =
            await CoupanModel.countDocuments();

        const responseData = {
            coupans,

            pagination: {
                page,
                limit,
                total,
                totalPages:
                    Math.ceil(
                        total / limit
                    )
            }
        };

        await setCache(
            cacheKey,
            responseData,
            300
        );

        return res.status(200).json({
            success: true,
            source: "mongodb",
            data: responseData
        });

    } catch (error) {

        logger.error(
            "Error fetching coupons",
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
            message:
                "Error fetching coupons"
        });
    }
};


export const GetCoupan = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params as { id: string };

    try {

        const version =
            await getCacheVersion(
                CoupanCacheKeys.detailsVersion(
                    id
                )
            );

        const cacheKey =
            CoupanCacheKeys.details(
                id,
                version
            );

        const cachedCoupan =
            await getCache(cacheKey);

        if (cachedCoupan) {

            return res.status(200).json({
                success: true,
                source: "redis",
                data: cachedCoupan
            });
        }

        const coupan =
            await CoupanModel
                .findById(id)
                .lean();

        if (!coupan) {

            return res.status(404).json({
                success: false,
                message:
                    "Coupon not found"
            });
        }

        await setCache(
            cacheKey,
            coupan,
            300
        );

        return res.status(200).json({
            success: true,
            source: "mongodb",
            data: coupan
        });

    } catch (error) {

        logger.error(
            "Error fetching coupon",
            {
                metadata: {
                    coupanId: id,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );

        return res.status(500).json({
            success: false,
            message:
                "Error fetching coupon"
        });
    }
};


export const UpdateCoupan = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params as { id: string };

    const {
        name,
        description,
        code,
        discount,
        isActive,
        expiryDate
    } = req.body;

    const requestId =
        crypto.randomUUID();

    const userId = req.body.id;

    try {

        const coupan =
            await CoupanModel.findById(id);

        if (!coupan) {

            return res.status(404).json({
                success: false,
                message:
                    "Coupon not found"
            });
        }

        const job =
            await coupanUpdateQueue.add(
                "coupan-update",
                {
                    requestId,
                    userId,
                    id,

                    coupanData: {
                        name,
                        description,
                        code,
                        discount,
                        isActive,
                        expiryDate
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

        await createNotification({
            userId,
            message:
                `Coupon "${coupan.name}" has been queued for update.`,
            type: "info"
        });

        return res.status(202).json({
            success: true,
            message:
                "Coupon update is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (error) {

        logger.error(
            "Error updating coupon",
            {
                metadata: {
                    coupanId: id,
                    requestId,
                    userId,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );
        await createNotification({
            userId,
            message: `Your request to update coupon "${name}" failed.`,
            type: "error"
        });
        return res.status(500).json({
            success: false,
            message:
                "Error updating coupon"
        });
    }
};


export const DeleteCoupan = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params as { id: string };

    const requestId =
        crypto.randomUUID();

    const userId = req.body.id;
    const coupan =
        await CoupanModel.findById(id);

    if (!coupan) {

        return res.status(404).json({
            success: false,
            message:
                "Coupon not found"
        });
    }
    try {
        const job =
            await coupanDeleteQueue.add(
                "coupan-delete",
                {
                    userId,
                    requestId,
                    id
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

        await createNotification({
            userId,
            message:
                `Coupon "${coupan.name}" has been queued for deletion.`,
            type: "warning"
        });

        return res.status(202).json({
            success: true,
            message:
                "Coupon deletion is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (error) {

        logger.error(
            "Error deleting coupon",
            {
                metadata: {
                    coupanId: id,
                    requestId,
                    userId,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );
        await createNotification({
            userId,
            message: `Your request to delete coupon "${coupan?.name || id}" failed.`,
            type: "error"
        });
        return res.status(500).json({
            success: false,
            message:
                "Error deleting coupon"
        });
    }
};
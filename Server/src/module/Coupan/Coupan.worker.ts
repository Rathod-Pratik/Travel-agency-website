import { Worker } from "bullmq";

import {
    bellmqConnection
} from "@config/redis";

import {
    CoupanModel
} from "./Coupan.model";

import {
    CreateCoupanJobData,
    UpdateCoupanJobData,
    DeleteCoupanJobData
} from "./Coupan.types";

import {
    CoupanCacheKeys
} from "@utils/cache/cacheKeys";

import {
    incrementCacheVersion
} from "@utils/index";

import {
    createNotification
} from "@modules/Notification/Notification.service";

import {
    logger
} from "@modules/log/logger";


export const coupanCreateWorker =
    new Worker<CreateCoupanJobData>(
        "coupan-creation",

        async (job) => {

            const {
                requestId,
                userId,
                coupanData
            } = job.data;

            logger.info(
                "Coupan Worker: Processing coupon creation job",
                {
                    metadata: {
                        requestId,
                        jobId: job.id,
                        userId,
                        code: coupanData.code
                    }
                }
            );

            if (
                new Date(coupanData.expiryDate) <=
                new Date()
            ) {

                throw new Error(
                    "Coupon expiry date must be in the future"
                );
            }

            const existingCoupan =
                await CoupanModel.findOne({
                    code: coupanData.code
                });

            if (existingCoupan) {

                logger.warn(
                    "Coupan creation failed - coupon already exists",
                    {
                        metadata: {
                            requestId,
                            userId,
                            code: coupanData.code
                        }
                    }
                );

                throw new Error(
                    "Coupon code already exists"
                );
            }

            const coupan =
                await CoupanModel.create({
                    name: coupanData.name,
                    description:
                        coupanData.description,
                    code:
                        coupanData.code,
                    discount:
                        coupanData.discount,
                    isActive:
                        coupanData.isActive ?? true,
                    expiryDate:
                        coupanData.expiryDate
                });

            await incrementCacheVersion(
                CoupanCacheKeys.listVersion()
            );

            await createNotification({
                userId,
                message:
                    `Coupon "${coupan.name}" has been created successfully.`,
                type: "success"
            });

            logger.info(
                "Coupan Worker: Coupon created successfully",
                {
                    metadata: {
                        requestId,
                        jobId: job.id,
                        userId,
                        coupanId:
                            coupan._id.toString(),
                        code:
                            coupan.code
                    }
                }
            );

            return {
                success: true,
                coupanId:
                    coupan._id.toString(),
                alreadyExists: false
            };
        },

        {
            connection: bellmqConnection,
            concurrency: 5
        }
    );


export const coupanUpdateWorker =
    new Worker<UpdateCoupanJobData>(
        "coupan-update",

        async (job) => {

            const {
                requestId,
                userId,
                id,
                coupanData
            } = job.data;

            logger.info(
                "Coupan Worker: Processing coupon update job",
                {
                    metadata: {
                        requestId,
                        jobId: job.id,
                        userId,
                        coupanId: id
                    }
                }
            );

            const coupan =
                await CoupanModel.findById(id);

            if (!coupan) {

                logger.warn(
                    "Coupan update failed - coupon not found",
                    {
                        metadata: {
                            requestId,
                            userId,
                            coupanId: id
                        }
                    }
                );

                throw new Error(
                    "Coupon not found"
                );
            }

            if (
                coupanData.expiryDate &&
                new Date(coupanData.expiryDate) <=
                new Date()
            ) {

                throw new Error(
                    "Coupon expiry date must be in the future"
                );
            }

            if (
                coupanData.code &&
                coupanData.code !== coupan.code
            ) {

                const existingCoupan =
                    await CoupanModel.findOne({
                        code:
                            coupanData.code,
                        _id: {
                            $ne: id
                        }
                    });

                if (existingCoupan) {

                    throw new Error(
                        "Coupon code already exists"
                    );
                }
            }

            if (
                coupanData.name !== undefined
            ) {
                coupan.name =
                    coupanData.name;
            }

            if (
                coupanData.description !== undefined
            ) {
                coupan.description =
                    coupanData.description;
            }

            if (
                coupanData.code !== undefined
            ) {
                coupan.code =
                    coupanData.code;
            }

            if (
                coupanData.discount !== undefined
            ) {
                coupan.discount =
                    coupanData.discount;
            }

            if (
                coupanData.isActive !== undefined
            ) {
                coupan.isActive =
                    coupanData.isActive;
            }

            if (
                coupanData.expiryDate !== undefined
            ) {
                coupan.expiryDate =
                    coupanData.expiryDate;
            }

            await coupan.save();

            await incrementCacheVersion(
                CoupanCacheKeys.listVersion()
            );

            await incrementCacheVersion(
                CoupanCacheKeys.detailsVersion(id)
            );

            await createNotification({
                userId,
                message:
                    `Coupon "${coupan.name}" has been updated successfully.`,
                type: "success"
            });

            logger.info(
                "Coupan Worker: Coupon updated successfully",
                {
                    metadata: {
                        requestId,
                        jobId: job.id,
                        userId,
                        coupanId: id,
                        code: coupan.code
                    }
                }
            );

            return {
                success: true,
                coupanId: id
            };
        },

        {
            connection: bellmqConnection,
            concurrency: 5
        }
    );


export const coupanDeleteWorker =
    new Worker<DeleteCoupanJobData>(
        "coupan-delete",

        async (job) => {

            const {
                requestId,
                userId,
                id
            } = job.data;

            logger.info(
                "Coupan Worker: Processing coupon delete job",
                {
                    metadata: {
                        requestId,
                        jobId: job.id,
                        userId,
                        coupanId: id
                    }
                }
            );

            const coupan =
                await CoupanModel.findById(id);

            if (!coupan) {

                logger.warn(
                    "Coupan deletion failed - coupon not found",
                    {
                        metadata: {
                            requestId,
                            userId,
                            coupanId: id
                        }
                    }
                );

                throw new Error(
                    "Coupon not found"
                );
            }

            await CoupanModel.findByIdAndDelete(
                id
            );

            await incrementCacheVersion(
                CoupanCacheKeys.listVersion()
            );

            await incrementCacheVersion(
                CoupanCacheKeys.detailsVersion(id)
            );

            await createNotification({
                userId,
                message:
                    `Coupon "${coupan.name}" has been deleted successfully.`,
                type: "success"
            });

            logger.info(
                "Coupan Worker: Coupon deleted successfully",
                {
                    metadata: {
                        requestId,
                        jobId: job.id,
                        userId,
                        coupanId: id,
                        code: coupan.code
                    }
                }
            );

            return {
                success: true,
                coupanId: id,
                deleted: true
            };
        },

        {
            connection: bellmqConnection,
            concurrency: 5
        }
    );
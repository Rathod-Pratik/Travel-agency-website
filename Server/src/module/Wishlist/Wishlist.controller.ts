import { Request, Response } from "express";
import crypto from "crypto";

import { WishlistModel } from "./Wishlist.model";
import { WishlistQueue } from "./Wishlist.queue";

import { logger } from "@modules/log/logger";
import { getCache, setCache, getCacheVersion } from "@utils/index";
import { WishlistCacheKeys } from "@utils/index";


export const AddWishlist = async (
    req: Request,
    res: Response
) => {

    const { tourId } = req.body;
    const userId = req.body.id;

    const requestId = crypto.randomUUID();

    try {

        const job = await WishlistQueue.add(
            "wishlist-add",
            {
                userId,
                tourId,
                requestId
            },
            {
                attempts: 5,

                backoff: {
                    type: "exponential",
                    delay: 3000
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
            "Wishlist add job added to queue",
            {
                metadata: {
                    jobId: job.id,
                    userId,
                    tourId,
                    requestId
                }
            }
        );

        return res.status(202).json({
            success: true,
            message: "Tour added to wishlist",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (err) {

        logger.error(
            "Error adding wishlist job",
            {
                metadata: {
                    userId,
                    tourId,
                    requestId,
                    error:
                        err instanceof Error
                            ? err.message
                            : String(err)
                }
            }
        );

        return res.status(500).json({
            success: false,
            message: "Failed to add tour to wishlist"
        });
    }
};

export const GetWishlist = async (
    req: Request,
    res: Response
) => {

    const userId = req.body.id;
    let page = Number(req.params.page) || 1;
    let limit = Number(req.params.limit) || 10;
    if(page<1){
        page = 1;
    }
    if(limit<1){
        limit = 10;
    }
    if(limit>100){
        limit = 100;
    }

    try {

        const version = await getCacheVersion(
            WishlistCacheKeys.listVersion()
        );

        const cacheKey = WishlistCacheKeys.list(
            version,
            page,
            limit,
            userId
        );

        const cachedWishlist = await getCache(cacheKey);

        if (cachedWishlist) {

            logger.info(
                "Wishlist retrieved from Redis",
                {
                    metadata: {
                        userId,
                        source: "redis"
                    }
                }
            );

            return res.status(200).json({
                success: true,
                message: "Wishlist retrieved successfully",
                source: "redis",
                data: cachedWishlist
            });
        }

        // Redis MISS → MongoDB
        const wishlist = await WishlistModel.find({ userId })
            .populate("tourId")
            .skip((page - 1) * limit)
            .limit(limit);

        // Empty wishlist
        if (!wishlist) {

            const emptyWishlist = {
                userId,
                tourId: []
            };

            await setCache(
                cacheKey,
                emptyWishlist,
                300
            );

            return res.status(200).json({
                success: true,
                message: "Wishlist is empty",
                source: "mongodb",
                data: emptyWishlist
            });
        }

        // Store populated tour data in Redis
        await setCache(
            cacheKey,
            wishlist,
            300
        );

        logger.info(
            "Wishlist retrieved from MongoDB",
            {
                metadata: {
                    userId,
                    source: "mongodb"
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Wishlist retrieved successfully",
            source: "mongodb",
            data: wishlist
        });

    } catch (err) {

        logger.error(
            "Error retrieving wishlist",
            {
                metadata: {
                    userId,
                    error:
                        err instanceof Error
                            ? err.message
                            : String(err)
                }
            }
        );

        return res.status(500).json({
            success: false,
            message: "Error retrieving wishlist"
        });
    }
};

export const RemoveWishlist = async (
    req: Request,
    res: Response
) => {

    const { tourId } = req.params as { tourId: string };

    const userId = req.body.id;

    const requestId = crypto.randomUUID();

    try {

        const job = await WishlistQueue.add(
            "wishlist-remove",
            {
                userId,
                tourId,
                requestId
            },
            {
                attempts: 5,

                backoff: {
                    type: "exponential",
                    delay: 3000
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
            "Wishlist remove job added to queue",
            {
                metadata: {
                    jobId: job.id,
                    userId,
                    tourId,
                    requestId
                }
            }
        );

        return res.status(202).json({
            success: true,
            message: "Tour removal from wishlist queued",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (err) {

        logger.error(
            "Error removing tour from wishlist",
            {
                metadata: {
                    userId,
                    tourId,
                    requestId,
                    error:
                        err instanceof Error
                            ? err.message
                            : String(err)
                }
            }
        );

        return res.status(500).json({
            success: false,
            message: "Failed to remove tour from wishlist"
        });
    }
};
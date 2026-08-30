import { Request, Response } from "express";
import crypto from "crypto";

import { ContentModel } from "./Content.model";
import { ContentQueue } from "./Content.queue";

import {
    ContentCacheKeys,
    getCacheVersion,
    getCache,
    setCache
} from "@utils/index";

import { logger } from "@modules/log/logger";

export const AddContent = async (
    req: Request,
    res: Response
) => {

    const {
        title,
        slug,
        type,
        content,
        isActive
    } = req.body;

    const requestId = crypto.randomUUID();


    try {

        const job = await ContentQueue.add(
            "content-create",
            {
                title,
                slug,
                type,
                content,
                isActive,
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
            "Content creation job added to queue",
            {
                metadata: {
                    jobId: job.id,
                    title,
                    slug,
                    type,
                    requestId
                }
            }
        );


        return res.status(202).json({
            success: true,
            message: "Content creation queued",
            data: {
                jobId: job.id,
                requestId
            }
        });


    } catch (err) {

        logger.error(
            "Error adding content creation job",
            {
                metadata: {
                    type,
                    slug,
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
            message: "Failed to queue content creation"
        });
    }
};

export const GetContent = async (
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
                ContentCacheKeys.listVersion()
            );


        const cacheKey =
            ContentCacheKeys.list(
                version,
                page,
                limit
            );


        const cachedContent =
            await getCache(cacheKey);


        if (cachedContent) {

            logger.info(
                "Content retrieved from Redis",
                {
                    metadata: {
                        page,
                        limit,
                        source: "redis"
                    }
                }
            );


            return res.status(200).json({
                success: true,
                message: "Content retrieved successfully",
                source: "redis",
                data: cachedContent
            });
        }


        const contents =
            await ContentModel
                .find()
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();


        const total =
            await ContentModel.countDocuments();


        const responseData = {
            contents,
            pagination: {
                page,
                limit,
                total,
                totalPages:
                    Math.ceil(total / limit)
            }
        };


        await setCache(
            cacheKey,
            responseData,
            300
        );


        logger.info(
            "Content retrieved from MongoDB",
            {
                metadata: {
                    count: contents.length,
                    page,
                    limit,
                    source: "mongodb"
                }
            }
        );


        return res.status(200).json({
            success: true,
            message: "Content retrieved successfully",
            source: "mongodb",
            data: responseData
        });


    } catch (err) {

        logger.error(
            "Error retrieving content",
            {
                metadata: {
                    page,
                    limit,
                    error:
                        err instanceof Error
                            ? err.message
                            : String(err)
                }
            }
        );


        return res.status(500).json({
            success: false,
            message: "Error retrieving content"
        });
    }
};

export const GetContentById = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params as {id: string};


    try {

        const version =
            await getCacheVersion(
                ContentCacheKeys.detailsVersion(id)
            );


        const cacheKey =
            ContentCacheKeys.details(
                id,
                version
            );


        const cachedContent =
            await getCache(cacheKey);


        if (cachedContent) {

            return res.status(200).json({
                success: true,
                message: "Content retrieved successfully",
                source: "redis",
                data: cachedContent
            });
        }


        const content =
            await ContentModel
                .findById(id)
                .lean();


        if (!content) {

            return res.status(404).json({
                success: false,
                message: "Content not found"
            });
        }


        await setCache(
            cacheKey,
            content,
            300
        );


        return res.status(200).json({
            success: true,
            message: "Content retrieved successfully",
            source: "mongodb",
            data: content
        });


    } catch (err) {

        logger.error(
            "Error retrieving content by ID",
            {
                metadata: {
                    contentId: id,
                    error:
                        err instanceof Error
                            ? err.message
                            : String(err)
                }
            }
        );


        return res.status(500).json({
            success: false,
            message: "Error retrieving content"
        });
    }
};

export const UpdateContent = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params as { id: string };

    const {
        title,
        slug,
        type,
        content,
        isActive
    } = req.body;

    const requestId = crypto.randomUUID();


    try {

        const job = await ContentQueue.add(
            "content-update",
            {
                id,
                title,
                slug,
                type,
                content,
                isActive,
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


        return res.status(202).json({
            success: true,
            message: "Content update queued",
            data: {
                jobId: job.id,
                requestId
            }
        });


    } catch (err) {

        logger.error(
            "Error adding content update job",
            {
                metadata: {
                    contentId: id,
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
            message: "Failed to queue content update"
        });
    }
};

export const DeleteContent = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params as { id: string };

    const requestId = crypto.randomUUID();


    try {

        const job = await ContentQueue.add(
            "content-delete",
            {
                id,
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


        return res.status(202).json({
            success: true,
            message: "Content deletion queued",
            data: {
                jobId: job.id,
                requestId
            }
        });


    } catch (err) {

        logger.error(
            "Error adding content deletion job",
            {
                metadata: {
                    contentId: id,
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
            message: "Failed to queue content deletion"
        });
    }
};
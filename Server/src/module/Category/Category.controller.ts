import { Request, Response } from "express";
import crypto from "crypto";

import { CategoryModel } from "./Category.model";

import {
    categoryCreationQueue,
    categoryUpdateQueue,
    categoryDeleteQueue
} from "./Category.queue";

import {
    CategoryCacheKeys,
    getCache,
    getCacheVersion,
    setCache
} from "@utils/index";

import { logger } from "@modules/log/logger";
import { createNotification } from "@modules/Notification/Notification.service";

export const CreateCategory = async (
    req: Request,
    res: Response
) => {

    const {
        name,
        slug,
        description,
        icon,
        isHomePage
    } = req.body;

    const requestId =
        crypto.randomUUID();

    try {

        const job =
            await categoryCreationQueue.add(
                "category-creation",
                {
                    requestId,
                    categoryData: {
                        name,
                        slug,
                        description,
                        icon,
                        isHomePage
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
            "Category creation job added to queue",
            {
                metadata: {
                    name,
                    slug,
                    requestId,
                    jobId: job.id
                }
            }
        );

        await createNotification({
            userId: req.body.id,
            message: "Category creation is being processed",
            type: "info"
        });
        return res.status(202).json({
            success: true,
            message: "Category creation is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (error) {

        logger.error(
            "Error creating category",
            {
                metadata: {
                    name,
                    requestId,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );
 await createNotification({
            userId: req.body?.id,
            message: `Your request to create category "${name}" failed.`,
            type: "error"
        });
        return res.status(500).json({
            success: false,
            message: "Error creating category"
        });
    }
};


export const GetCategories = async (
    req: Request,
    res: Response
) => {
    try {
        let isHomePage =
            req.query.isHomePage === "true";
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
                CategoryCacheKeys.listVersion()
            );

        const cacheKey =
            CategoryCacheKeys.list(
                version,
                page,
                limit
            );

        const cachedCategories =
            await getCache(cacheKey);

        if (cachedCategories) {

            logger.info(
                "Categories fetched from Redis",
                {
                    metadata: {
                        page,
                        limit,
                        source: "redis"
                    }
                }
            );

            return res.status(200).json(
                cachedCategories
            );
        }

        const categories =
            await CategoryModel
                .find({
                    isDeleted: false,
                    isHomePage: isHomePage
                })
                .sort({
                    createdAt: -1
                })
                .limit(limit)
                .skip(
                    (page - 1) * limit
                )
                .lean();

        if (
            !categories ||
            categories.length === 0
        ) {

            logger.warn(
                "No categories found",
                {
                    metadata: {
                        page,
                        limit
                    }
                }
            );

            return res.status(404).json({
                message: "No categories found"
            });
        }

        await setCache(
            cacheKey,
            categories,
            3600
        );

        logger.info(
            "Categories fetched successfully",
            {
                metadata: {
                    count: categories.length,
                    page,
                    limit,
                    source: "mongodb"
                }
            }
        );

        return res.status(200).json(
            categories
        );

    } catch (error) {

        logger.error(
            "Error fetching categories",
            {
                metadata: {
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error),
                    page: req.query.page,
                    limit: req.query.limit
                }
            }
        );

        return res.status(500).json({
            message: "Error fetching categories"
        });
    }
};


export const GetCategoryDetails = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params as { id: string };

    try {

        const version =
            await getCacheVersion(
                CategoryCacheKeys.detailsVersion(
                    id
                )
            );

        const cacheKey =
            CategoryCacheKeys.details(
                id,
                version
            );

        const cachedCategory =
            await getCache(cacheKey);

        if (cachedCategory) {

            logger.info(
                "Category details fetched from Redis",
                {
                    metadata: {
                        categoryId: id,
                        source: "redis"
                    }
                }
            );

            return res.status(200).json({
                success: true,
                source: "redis",
                data: cachedCategory
            });
        }

        const category =
            await CategoryModel
                .findOne({
                    _id: id,
                    isDeleted: false
                })
                .lean();

        if (!category) {

            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        await setCache(
            cacheKey,
            category,
            3600
        );

        logger.info(
            "Category details fetched successfully",
            {
                metadata: {
                    categoryId: id,
                    source: "mongodb"
                }
            }
        );

        return res.status(200).json({
            success: true,
            source: "mongodb",
            data: category
        });

    } catch (error) {

        logger.error(
            "Error fetching category details",
            {
                metadata: {
                    categoryId: id,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );

        return res.status(500).json({
            message: "Error fetching category details"
        });
    }
};


export const UpdateCategory = async (
    req: Request,
    res: Response
) => {

    const {
        name,
        slug,
        description,
        icon,
        isHomePage
    } = req.body;

    const { id } =
        req.params as { id: string };

    const requestId =
        crypto.randomUUID();

    try {

        const existingCategory =
            await CategoryModel.findById(id);

        if (!existingCategory) {

            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        if (existingCategory.isDeleted) {

            return res.status(400).json({
                success: false,
                message: "Category is already deleted"
            });
        }

        const job =
            await categoryUpdateQueue.add(
                "category-update",
                {
                    requestId,
                    id,
                    categoryData: {
                        name,
                        slug,
                        description,
                        icon,
                        isHomePage
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
            "Category update job added to queue",
            {
                metadata: {
                    categoryId: id,
                    requestId,
                    jobId: job.id
                }
            }
        );

        await createNotification({
            userId: req.body.id,
            message: "Category update is being processed",
            type: "info"
        });

        return res.status(202).json({
            success: true,
            message: "Category update is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (error) {

        logger.error(
            "Error updating category",
            {
                metadata: {
                    categoryId: id,
                    requestId,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );
 await createNotification({
            userId: req.body?.id,
            message: `Your request to update category "${name}" failed.`,
            type: "error"
        });
        return res.status(500).json({
            success: false,
            message: "Error updating category"
        });
    }
};


export const DeleteCategory = async (
    req: Request,
    res: Response
) => {

    const { id } =
        req.params as { id: string };

    const requestId =
        crypto.randomUUID();
    const existingCategory =
        await CategoryModel.findById(id);

    if (!existingCategory) {

        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }

    if (existingCategory.isDeleted) {

        return res.status(400).json({
            success: false,
            message: "Category is already deleted"
        });
    }
    try {



        const job =
            await categoryDeleteQueue.add(
                "category-delete",
                {
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

        logger.info(
            "Category delete job added to queue",
            {
                metadata: {
                    categoryId: id,
                    requestId,
                    jobId: job.id
                }
            }
        );

        await createNotification({
            userId: req.body.id,
            message: "Category deletion is being processed",
            type: "info"
        });

        return res.status(202).json({
            success: true,
            message: "Category deletion is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (error) {

        logger.error(
            "Error deleting category",
            {
                metadata: {
                    categoryId: id,
                    requestId,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );
        await createNotification({
            userId: req.body?.id,
            message: `Your request to delete category "${existingCategory.name}" failed.`,
            type: "error"
        });
        return res.status(500).json({
            success: false,
            message: "Error deleting category"
        });
    }
};
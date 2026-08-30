import { Worker } from "bullmq";
import { bellmqConnection } from "@config/redis";

import { CategoryModel } from "./Category.model";

import {
    CreateCategoryJobData,
    UpdateCategoryJobData,
    DeleteCategoryJobData
} from "./Category.types";

import {
    CategoryCacheKeys,
    incrementCacheVersion
} from "@utils/index";

import { logger } from "@modules/log/logger";


export const categoryCreateWorker =
    new Worker<CreateCategoryJobData>(
        "category-creation",

        async (job) => {

            const {
                requestId,
                categoryData
            } = job.data;

            logger.info(
                "Category Worker: Processing category creation job",
                {
                    metadata: {
                        requestId,
                        categoryData
                    }
                }
            );

            const existingCategory =
                await CategoryModel.findOne({
                    $or: [
                        {
                            slug: categoryData.slug
                        },
                        {
                            name: categoryData.name
                        }
                    ]
                });

            if (existingCategory) {

                logger.warn(
                    "Category creation failed - category already exists",
                    {
                        metadata: {
                            requestId,
                            categoryId: existingCategory._id
                        }
                    }
                );

                return {
                    categoryId: existingCategory._id,
                    alreadyExists: true
                };
            }

            const category =
                await CategoryModel.create({
                    ...categoryData
                });

            await incrementCacheVersion(
                CategoryCacheKeys.listVersion()
            );

            logger.info(
                "Category Worker: Category created successfully",
                {
                    metadata: {
                        requestId,
                        categoryId: category._id
                    }
                }
            );

            return {
                categoryId: category._id,
                alreadyExists: false
            };
        },
        {
            connection: bellmqConnection,
            concurrency: 5
        }
    );


export const categoryUpdateWorker =
    new Worker<UpdateCategoryJobData>(
        "category-update",

        async (job) => {

            const {
                requestId,
                categoryData,
                id
            } = job.data;

            logger.info(
                "Category Worker: Processing category update job",
                {
                    metadata: {
                        requestId,
                        categoryId: id,
                        categoryData
                    }
                }
            );

            const existingCategory =
                await CategoryModel.findById(id);

            if (!existingCategory) {

                logger.warn(
                    "Category update failed - category not found",
                    {
                        metadata: {
                            requestId,
                            categoryId: id
                        }
                    }
                );

                return;
            }

            if (existingCategory.isDeleted) {

                logger.warn(
                    "Category update failed - category already deleted",
                    {
                        metadata: {
                            requestId,
                            categoryId: id
                        }
                    }
                );

                return;
            }

            const category =
                await CategoryModel.findByIdAndUpdate(
                    id,
                    {
                        $set: categoryData
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                ).lean();

            if (!category) {
                throw new Error(
                    "Category update failed"
                );
            }

            await incrementCacheVersion(
                CategoryCacheKeys.listVersion()
            );

            await incrementCacheVersion(
                CategoryCacheKeys.detailsVersion(id)
            );

            logger.info(
                "Category Worker: Category updated successfully",
                {
                    metadata: {
                        requestId,
                        categoryId: id
                    }
                }
            );

            return {
                categoryId: category._id.toString(),
                updated: true
            };
        },
        {
            connection: bellmqConnection,
            concurrency: 5
        }
    );


export const categoryDeleteWorker =
    new Worker<DeleteCategoryJobData>(
        "category-delete",

        async (job) => {

            const {
                id,
                requestId
            } = job.data;

            logger.info(
                "Category Worker: Processing category delete job",
                {
                    metadata: {
                        requestId,
                        categoryId: id
                    }
                }
            );

            const existingCategory =
                await CategoryModel.findById(id);

            if (!existingCategory) {

                logger.warn(
                    "Category delete failed - category not found",
                    {
                        metadata: {
                            requestId,
                            categoryId: id
                        }
                    }
                );

                return;
            }

            if (existingCategory.isDeleted) {

                logger.warn(
                    "Category delete failed - category already deleted",
                    {
                        metadata: {
                            requestId,
                            categoryId: id
                        }
                    }
                );

                return;
            }

            const category =
                await CategoryModel.findByIdAndUpdate(
                    {
                        _id: id
                    },
                    {
                        isDeleted: true,
                        DeletedAt: new Date()
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                ).lean();

            if (!category) {

                logger.error(
                    "Category Worker: Category delete failed",
                    {
                        metadata: {
                            requestId,
                            categoryId: id
                        }
                    }
                );

                return {
                    categoryId: id,
                    deleted: false
                };
            }

            await incrementCacheVersion(
                CategoryCacheKeys.listVersion()
            );

            await incrementCacheVersion(
                CategoryCacheKeys.detailsVersion(id)
            );

            logger.info(
                "Category Worker: Category deleted successfully",
                {
                    metadata: {
                        requestId,
                        categoryId: id
                    }
                }
            );

            return {
                categoryId: id,
                deleted: true
            };
        },
        {
            connection: bellmqConnection,
            concurrency: 5
        }
    );
import { Worker } from "bullmq";
import { bellmqConnection } from "@config/redis";

import { BlogModel } from "./Blog.model";

import {
    CreateBlogJobData,
    UpdateBlogJobData,
    DeleteBlogJobData
} from "./Blog.types";

import {
    Delete_S3_File,
    BlogCacheKeys,
    incrementCacheVersion
} from "@utils/index";

import { logger } from "@modules/log/logger";
import { createNotification } from "@modules/Notification/Notification.service";

export const blogCreateWorker =
    new Worker<CreateBlogJobData>(
        "blog-creation",
        async (job) => {

            const {
                requestId,
                blogData,
                imagekeys,
                userId,
            } = job.data;

            logger.info(
                "Blog Worker: Processing blog creation job",
                {
                    metadata: {
                        requestId,
                        blogData,
                        imagekeys
                    }
                }
            );

            const blog = await BlogModel.create({
                ...blogData,
                image: imagekeys
            });

            await incrementCacheVersion(
                BlogCacheKeys.listVersion()
            );

            logger.info(
                "Blog Worker: Blog created successfully",
                {
                    metadata: {
                        requestId,
                        blogId: blog._id
                    }
                }
            );

            await createNotification({
                userId: userId,
                message: `Your blog "${blogData.title}" has been created successfully.`,
                type: "info"
            });

            return {
                blogId: blog._id,
                alreadyCreated: false
            };
        },
        {
            connection: bellmqConnection,
            concurrency: 5
        }
    );


export const blogUpdateWorker =
    new Worker<UpdateBlogJobData>(
        "blog-update",
        async (job) => {

            const {
                userId,
                requestId,
                blogData,
                imagekeys,
                id
            } = job.data;

            logger.info(
                "Blog Worker: Processing blog update job",
                {
                    metadata: {
                        requestId,
                        blogId: id,
                        blogData,
                        imagekeys
                    }
                }
            );

            const existingBlog =
                await BlogModel.findById(id);

            if (!existingBlog) {

                logger.warn(
                    "Blog update failed - blog not found",
                    {
                        metadata: {
                            requestId,
                            blogId: id
                        }
                    }
                );

                return;
            }

            if (existingBlog.isDeleted) {

                logger.warn(
                    "Blog update failed - blog already deleted",
                    {
                        metadata: {
                            requestId,
                            blogId: id
                        }
                    }
                );

                return;
            }

            let removedImageKeys: string[] = [];

            if (imagekeys !== undefined) {

                removedImageKeys =
                    existingBlog.image.filter(
                        (oldKey) =>
                            !imagekeys.includes(oldKey)
                    );
            }

            const updateData = {
                ...blogData,
                ...(imagekeys !== undefined
                    ? { image: imagekeys }
                    : {})
            };

            const blog =
                await BlogModel.findByIdAndUpdate(
                    id,
                    updateData,
                    {
                        new: true,
                        runValidators: true
                    }
                ).lean();

            if (!blog) {
                throw new Error(
                    "Blog update failed"
                );
            }

           await createNotification({
                userId: userId,
                message: `Your blog "${blogData.title}" has been updated successfully.`,
                type: "info"
            });
            await incrementCacheVersion(
                BlogCacheKeys.listVersion()
            );

            await incrementCacheVersion(
                BlogCacheKeys.detailsVersion(id)
            );

            if (removedImageKeys.length > 0) {

                await Promise.all(
                    removedImageKeys.map(
                        (key) =>
                            Delete_S3_File(key)
                    )
                );

                logger.info(
                    "Old blog images deleted",
                    {
                        metadata: {
                            blogId: id,
                            deletedImages:
                                removedImageKeys
                        }
                    }
                );
            }

            logger.info(
                "Blog Worker: Blog updated successfully",
                {
                    metadata: {
                        requestId,
                        blogId: id
                    }
                }
            );

            return {
                blogId: blog._id.toString(),
                updated: true
            };
        },
        {
            connection: bellmqConnection,
            concurrency: 5
        }
    );


export const blogDeleteWorker =
    new Worker<DeleteBlogJobData>(
        "blog-delete",
        async (job) => {

            const {
                id,
                requestId,
                userId
            } = job.data;

            logger.info(
                "Blog Worker: Processing blog delete job",
                {
                    metadata: {
                        requestId,
                        blogId: id
                    }
                }
            );

            const existingBlog =
                await BlogModel.findById(id);

            if (!existingBlog) {

                logger.warn(
                    "Blog delete failed - blog not found",
                    {
                        metadata: {
                            requestId,
                            blogId: id
                        }
                    }
                );

                return;
            }

            if (existingBlog.isDeleted) {

                logger.warn(
                    "Blog delete failed - blog already deleted",
                    {
                        metadata: {
                            requestId,
                            blogId: id
                        }
                    }
                );

                return;
            }

            const blog =
                await BlogModel.findByIdAndUpdate(
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

            if (!blog) {

                logger.error(
                    "Blog Worker: Blog delete failed",
                    {
                        metadata: {
                            requestId,
                            blogId: id
                        }
                    }
                );

                return {
                    blogId: id,
                    deleted: false
                };
            }
            await createNotification({
                userId: userId,
                message: `Your blog "${existingBlog.title}" has been deleted successfully.`,
                type: "info"
            });
            await incrementCacheVersion(
                BlogCacheKeys.listVersion()
            );

            await incrementCacheVersion(
                BlogCacheKeys.detailsVersion(id)
            );

            if (blog.image.length > 0) {

                await Promise.all(
                    blog.image.map(
                        (key) =>
                            Delete_S3_File(key)
                    )
                );
            }

            logger.info(
                "Blog Worker: Blog deleted successfully",
                {
                    metadata: {
                        requestId,
                        blogId: id
                    }
                }
            );

            return {
                blogId: id,
                deleted: true
            };
        },
        {
            connection: bellmqConnection,
            concurrency: 5
        }
    );
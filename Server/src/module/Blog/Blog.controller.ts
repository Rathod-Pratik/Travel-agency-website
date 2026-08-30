import { Request, Response } from "express";

import {
    Get_Signed_Url,
    getMultipleUploadedFiles,
    uploadWithRetry,
    BlogCacheKeys,
    getCache,
    getCacheVersion,
    setCache
} from "@utils/index";

import { BlogModel } from "./Blog.model";
import { IBlog } from "./Blog.types";

import {
    blogCreationQueue,
    blogUpdateQueue,
    blogDeleteQueue
} from "./Blog.queue";

import { logger } from "@modules/log/logger";
import { createNotification } from "@modules/Notification/Notification.service";


const GetSignedImages = async (
    images: string[]
) => {

    return Promise.all(
        images.map(async (key) => {
            return await Get_Signed_Url({
                key
            });
        })
    );
};


export const BlogResponse = async (
    blog: IBlog
) => {

    return {
        ...blog,
        image: await GetSignedImages(
            blog.image
        )
    };
};


export const BlogsResponse = async (
    blogs: IBlog[]
) => {

    return Promise.all(
        blogs.map(async (blog) => ({
            ...blog,
            image: await GetSignedImages(
                blog.image.slice(0, 1)
            )
        }))
    );
};


export const GetBlogs = async (
    req: Request,
    res: Response
) => {

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
                BlogCacheKeys.listVersion()
            );

        const cacheKey =
            BlogCacheKeys.list(
                version,
                page,
                limit
            );

        const cachedBlogs =
            await getCache(cacheKey);

        if (cachedBlogs) {

            logger.info(
                "Blogs fetched from Redis",
                {
                    metadata: {
                        page,
                        limit,
                        source: "redis"
                    }
                }
            );

            return res.status(200).json(
                cachedBlogs
            );
        }

        const blogs =
            await BlogModel
                .find({
                    isDeleted: false
                })
                .limit(limit)
                .skip(
                    (page - 1) * limit
                )
                .lean();

        if (!blogs || blogs.length === 0) {

            logger.warn(
                "No blogs found",
                {
                    metadata: {
                        page,
                        limit
                    }
                }
            );

            return res.status(404).json({
                message: "No blogs found"
            });
        }

        const response =
            await BlogsResponse(blogs);

        await setCache(
            cacheKey,
            response,
            3600
        );

        logger.info(
            "Blogs fetched successfully",
            {
                metadata: {
                    count: blogs.length,
                    page,
                    limit,
                    source: "mongodb"
                }
            }
        );

        return res.status(200).json(
            response
        );

    } catch (error) {

        logger.error(
            "Error fetching blogs",
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
            message: "Error fetching blogs"
        });
    }
};


export const GetBlogDetails = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params as { id: string };

    try {

        const version =
            await getCacheVersion(
                BlogCacheKeys.detailsVersion(
                    id
                )
            );

        const cacheKey =
            BlogCacheKeys.details(
                id,
                version
            );

        const cachedBlog =
            await getCache(cacheKey);

        if (cachedBlog) {

            logger.info(
                "Blog details fetched from Redis",
                {
                    metadata: {
                        blogId: id,
                        source: "redis"
                    }
                }
            );

            return res.status(200).json({
                success: true,
                source: "redis",
                data: cachedBlog
            });
        }

        const blog =
            await BlogModel
                .findOne({
                    _id: id,
                    isDeleted: false
                })
                .lean();

        if (!blog) {

            return res.status(404).json({
                message: "Blog not found"
            });
        }

        const response =
            await BlogResponse(blog);

        await setCache(
            cacheKey,
            response,
            3600
        );

        return res.status(200).json({
            data: response
        });

    } catch (error) {

        logger.error(
            "Error fetching blog details",
            {
                metadata: {
                    blogId: id,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );

        return res.status(500).json({
            message: "Error fetching blog details"
        });
    }
};


export const CreateBlog = async (
    req: Request,
    res: Response
) => {

    const {
        title,
        description
    } = req.body;

    const requestId =
        crypto.randomUUID();

    const files =
        getMultipleUploadedFiles(req);

    try {

        if (!files.length) {

            logger.warn(
                "Blog creation failed - images missing",
                {
                    metadata: {
                        title,
                        requestId
                    }
                }
            );

            await createNotification({
                userId: req.body.id,
                message: "Blog creation failed due to missing images",
                type: "error"
            });

            return res.status(400).json({
                success: false,
                message: "Images are required"
            });
        }

        const uploadedFiles =
            await Promise.all(
                files.map(
                    (file) =>
                        uploadWithRetry(
                            file,
                            3,
                            "Blog"
                        )
                )
            );

        const imagekeys =
            uploadedFiles.map(
                (file) =>
                    file.key
            );

        const blogData = {
            title,
            description
        };

        const job =
            await blogCreationQueue.add(
                "blog-creation",
                {
                    requestId,
                    blogData,
                    imagekeys,
                    userId: req.body.id
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
            "Blog creation job added to queue",
            {
                metadata: {
                    title,
                    requestId,
                    jobId: job.id
                }
            }
        );

        await createNotification({
            userId: req.body.id,
            message: "Blog creation is being processed",
            type: "info"
        });

        return res.status(202).json({
            success: true,
            message: "Blog creation is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (error) {

        await createNotification({
            userId: req.body.id,
            message: "Blog creation failed",
            type: "error"
        });
        logger.error(
            "Error creating blog",
            {
                metadata: {
                    title,
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
            message: "Error creating blog"
        });
    }
};


export const UpdateBlog = async (
    req: Request,
    res: Response
) => {

    const {
        title,
        description
    } = req.body;

    const { id } =
        req.params as { id: string };

    const requestId =
        crypto.randomUUID();

    try {

        const existingBlog =
            await BlogModel.findById(id);

        if (!existingBlog) {

            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        if (existingBlog.isDeleted) {

            await createNotification({
                userId: req.body.id,
                message: "Blog update failed - blog is deleted",
                type: "error"
            });
            return res.status(400).json({
                success: false,
                message: "Blog is already deleted"
            });
        }

        const files =
            getMultipleUploadedFiles(req);

        let imagekeys:
            string[] | undefined;

        if (files.length > 0) {

            const uploadedFiles =
                await Promise.all(
                    files.map(
                        (file) =>
                            uploadWithRetry(
                                file,
                                3,
                                "Blog"
                            )
                    )
                );

            imagekeys =
                uploadedFiles.map(
                    (file) =>
                        file.key
                );
        }

        const blogData = {
            title,
            description
        };

        const job =
            await blogUpdateQueue.add(
                "blog-update",
                {
                    id,
                    requestId,
                    blogData,
                    imagekeys,
                    userId: req.body.id
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
            "Blog update job added to queue",
            {
                metadata: {
                    blogId: id,
                    requestId,
                    jobId: job.id,
                    hasNewImages:
                        Boolean(
                            imagekeys?.length
                        )
                }
            }
        );

        await createNotification({
            userId: req.body.id,
            message: "Blog update is being processed",
            type: "info"
        });
        return res.status(202).json({
            success: true,
            message: "Blog update is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (error) {

        logger.error(
            "Error updating blog",
            {
                metadata: {
                    blogId: id,
                    requestId,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );

        await createNotification({
            userId: req.body.id,
            message: "Blog update failed",
            type: "error"
        });

        return res.status(500).json({
            success: false,
            message: "Error updating blog"
        });
    }
};


export const DeleteBlog = async (
    req: Request,
    res: Response
) => {

    const { id } =
        req.params as { id: string };

    const requestId =
        crypto.randomUUID();

    try {

        const existingBlog =
            await BlogModel.findById(id);

        if (!existingBlog) {
            await createNotification({
                userId: req.body.id,
                message: "Blog deletion failed - blog not found",
                type: "error"
            });
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        if (existingBlog.isDeleted) {
            await createNotification({
                userId: req.body.id,
                message: "Blog deletion failed - blog is already deleted",
                type: "error"
            });
            return res.status(400).json({
                success: false,
                message: "Blog is already deleted"
            });
        }

        const job =
            await blogDeleteQueue.add(
                "blog-delete",
                {
                    requestId,
                    id,
                    userId: req.body.id,
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
            "Blog delete job added to queue",
            {
                metadata: {
                    blogId: id,
                    requestId,
                    jobId: job.id
                }
            }
        );
        await createNotification({
            userId: req.body.id,
            message: "Blog deletion is being processed",
            type: "info"
        });
        return res.status(202).json({
            success: true,
            message: "Blog deletion is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (error) {

        logger.error(
            "Error deleting blog",
            {
                metadata: {
                    blogId: id,
                    requestId,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );

        await createNotification({
            userId: req.body.id,
            message: "Error deleting blog",
            type: "error"
        });

        return res.status(500).json({
            success: false,
            message: "Error deleting blog"
        });
    }
};
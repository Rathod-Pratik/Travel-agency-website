import {
    deleteFile,
    getUploadedFile,
    uploadFileToS3,
} from "@utils/Function";

import { Request, Response } from "express";

import { BlogModel } from "./Blog.model";

import {
    getCacheVersion,
    incrementCacheVersion,
    BlogCacheKeys,
    setCache,
    getCache
} from "@utils/index";

import { logger } from "@modules/log/logger";


export const CreateBlog = async (
    req: Request,
    res: Response
) => {

    const { title, description } = req.body;

    try {

        const file = getUploadedFile(req);

        if (!file) {

            logger.warn("Blog creation failed - image missing", {
                metadata: {
                    title
                }
            });

            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }

        const uploadedFile = await uploadFileToS3({
            buffer: file.buffer,
            fileName: file.originalname,
            fileType: file.mimetype,
            folderType: "Blog",
        });

        const blog = await BlogModel.create({
            title,
            description,
            image: uploadedFile.url,
        });

        await incrementCacheVersion(
            BlogCacheKeys.listVersion()
        );

        logger.info("Blog created successfully", {
            metadata: {
                blogId: blog._id.toString(),
                title
            }
        });

        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: blog,
        });

    } catch (err) {

        logger.error("CreateBlog error", {
            metadata: {
                title,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error creating blog",
        });
    }
};


export const UpdateBlog = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params;
    const { title, description } = req.body;

    try {

        const file = getUploadedFile(req);

        const blog = await BlogModel.findById(id);

        if (!blog) {

            logger.warn("Blog update failed - blog not found", {
                metadata: {
                    blogId: id
                }
            });

            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        const updatedBlog: {
            title?: string;
            description?: string;
            image?: string;
        } = {};

        if (title !== undefined) {
            updatedBlog.title = title;
        }

        if (description !== undefined) {
            updatedBlog.description = description;
        }

        if (file) {

            const uploadedFile = await uploadFileToS3({
                buffer: file.buffer,
                fileName: file.originalname,
                fileType: file.mimetype,
                folderType: "Blog",
            });

            updatedBlog.image = uploadedFile.url;

            if (blog.image) {
                await deleteFile(blog.image);
            }
        }

        const updatedBlogData =
            await BlogModel.findByIdAndUpdate(
                id,
                updatedBlog,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!updatedBlogData) {

            logger.warn("Blog update failed - blog not found", {
                metadata: {
                    blogId: id
                }
            });

            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        await incrementCacheVersion(
            BlogCacheKeys.detailsVersion(id as string)
        );

        await incrementCacheVersion(
            BlogCacheKeys.listVersion()
        );

        logger.info("Blog updated successfully", {
            metadata: {
                blogId: id
            }
        });

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: updatedBlogData,
        });

    } catch (err) {

        logger.error("UpdateBlog error", {
            metadata: {
                blogId: id,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error updating blog",
        });
    }
};


export const DeleteBlog = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params;

    try {

        const blog = await BlogModel.findById(id);

        if (!blog) {

            logger.warn("Blog deletion failed - blog not found", {
                metadata: {
                    blogId: id
                }
            });

            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        await BlogModel.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
                DeletedAt: new Date()
            }
        );

        await incrementCacheVersion(
            BlogCacheKeys.detailsVersion(id as string)
        );

        await incrementCacheVersion(
            BlogCacheKeys.listVersion()
        );

        logger.info("Blog deleted successfully", {
            metadata: {
                blogId: id
            }
        });

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });

    } catch (err) {

        logger.error("DeleteBlog error", {
            metadata: {
                blogId: id,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error deleting blog",
        });
    }
};


export const GetBlog = async (
    req: Request,
    res: Response
) => {

    try {

        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;

        if (page < 1) {
            page = 1;
        }

        if (limit < 1) {
            limit = 10;
        }

        if (limit > 100) {
            limit = 100;
        }

        const version = await getCacheVersion(
            BlogCacheKeys.listVersion()
        );

        const cacheKey = BlogCacheKeys.list(
            version,
            page,
            limit
        );

        const cachedData = await getCache(cacheKey);

        if (cachedData) {

            logger.info("Blogs retrieved from cache", {
                metadata: {
                    page,
                    limit,
                    source: "cache"
                }
            });

            return res.status(200).json({
                success: true,
                message: "Blogs retrieved successfully",
                source: "cache",
                page,
                limit,
                data: cachedData,
            });
        }

        const blogs = await BlogModel.find({
            isDeleted: false
        })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        if (blogs.length === 0) {

            logger.warn("No blogs found", {
                metadata: {
                    page,
                    limit
                }
            });

            return res.status(404).json({
                success: false,
                message: "No blogs found",
            });
        }

        await setCache(
            cacheKey,
            blogs,
            600
        );

        logger.info("Blogs retrieved from database", {
            metadata: {
                count: blogs.length,
                page,
                limit,
                source: "database"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Blogs retrieved successfully",
            source: "database",
            page,
            limit,
            data: blogs,
        });

    } catch (err) {

        logger.error("GetBlog error", {
            metadata: {
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error retrieving blogs",
        });
    }
};


export const GetBlogById = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params;

    try {

        if (!id) {

            logger.warn("Get blog failed - blog ID missing");

            return res.status(400).json({
                success: false,
                message: "Blog ID is required",
            });
        }

        const version = await getCacheVersion(
            BlogCacheKeys.detailsVersion(id as string)
        );

        const cacheKey = BlogCacheKeys.details(
            id as string,
            version
        );

        const cachedData = await getCache(cacheKey);

        if (cachedData) {

            logger.info("Blog retrieved from cache", {
                metadata: {
                    blogId: id,
                    source: "cache"
                }
            });

            return res.status(200).json({
                success: true,
                message: "Blog retrieved successfully",
                source: "cache",
                data: cachedData,
            });
        }

        const blog = await BlogModel
            .findById(id)
            .lean();

        if (!blog) {

            logger.warn("Blog not found", {
                metadata: {
                    blogId: id
                }
            });

            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        await setCache(
            cacheKey,
            blog,
            600
        );

        logger.info("Blog retrieved from database", {
            metadata: {
                blogId: id,
                source: "database"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Blog retrieved successfully",
            source: "database",
            data: blog,
        });

    } catch (err) {

        logger.error("GetBlogById error", {
            metadata: {
                blogId: id,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error retrieving blog",
        });
    }
};
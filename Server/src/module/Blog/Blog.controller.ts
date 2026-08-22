import { deleteFile, getUploadedFile, uploadFileToS3 } from "@utils/Function";
import { Request, Response } from "express";
import { BlogModel } from "./Blog.model";

export const CreateBlog = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const file = getUploadedFile(req);
    try {
        if (!file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const uploadedFile = await uploadFileToS3
            ({
                buffer: file.buffer,
                fileName: file.originalname,
                fileType: file.mimetype,
                folderType: "Blog",
            });

        const newBlog = {
            title,
            description,
            image: uploadedFile.url,
        };
        const blog = await BlogModel.create(newBlog);
        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: blog,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error creating blog",
            data: err,
        });
    }
}
export const UpdateBlog = async (req: Request, res: Response) => {
    const { id } = req.params;
    const file = getUploadedFile(req);
    try {
        const blog = await BlogModel.findById({ _id: id });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        if (file) {
            const uploadedFile = await uploadFileToS3({
                buffer: file.buffer,
                fileName: file.originalname,
                fileType: file.mimetype,
                folderType: "Blog",
            });
            blog.image = uploadedFile.url;

            await deleteFile(blog.image);
        }
        await blog.save();
        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: blog,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error updating blog",
            data: err,
        });
    }
}
export const DeleteBlog = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const blog = await BlogModel.findById({ _id: id });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        await deleteFile(blog.image);
        await BlogModel.findByIdAndDelete({ _id: id });
        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error deleting blog",
            data: err,
        });
    }
}
export const GetBlog = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const blogs = await BlogModel.find()
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ message: "Blog not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Blog retrieved successfully",
            data: blogs,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving blog",
            data: err,
        });
    }
}
export const GetBlogById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const blog = await BlogModel.findById({ _id: id });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Blog retrieved successfully",
            data: blog,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving blog",
            data: err,
        });
    }
}
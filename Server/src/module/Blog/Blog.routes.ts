import { verifyAdmin } from '@middleware/Auth.middleware';
import upload from '@middleware/Multer.middleware';
import express from 'express'
import { CreateBlog, UpdateBlog, DeleteBlog, GetBlogs, GetBlogDetails } from './Blog.controller';
import { Validate } from '@middleware/Validation.middleware';
import { BlogSchema, BlogIdSchema, UpdateBlogSchema } from './Blog.validation';

const Route = express.Router();

Route.post(
    "/",
    verifyAdmin,
    Validate(BlogSchema),
    upload.single("image"),
    CreateBlog
);

Route.put(
    "/:id",
    verifyAdmin,
    Validate(UpdateBlogSchema),
    upload.single("image"),
    UpdateBlog
);

Route.delete(
    "/:id",
    verifyAdmin,
    Validate(BlogIdSchema),
    DeleteBlog
);

Route.get(
    "/",
    GetBlogs
);

Route.get(
    "/:id",
    Validate(BlogIdSchema),
    GetBlogDetails
);

export default Route;
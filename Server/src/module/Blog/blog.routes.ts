import { verifyAdmin } from '@middleware/Auth.middleware';
import upload from '@middleware/Multer.middleware';
import express from 'express'
import { CreateBlog, UpdateBlog, DeleteBlog, GetBlog, GetBlogById } from './Blog.controller';
import { Validate } from '@middleware/Validation.middleware';
import { IBlogSchema, IGetBlogSchema, IGetBlogsSchema, IUpdateBlogSchema } from './Blog.validation';

const Route = express.Router();

Route.post(
    "/",
    verifyAdmin,
    Validate(IBlogSchema),
    upload.single("image"),
    CreateBlog
);

Route.put(
    "/:id",
    verifyAdmin,
    Validate(IUpdateBlogSchema),
    upload.single("image"),
    UpdateBlog
);

Route.delete(
    "/:id",
    verifyAdmin,
    Validate(IGetBlogSchema),
    DeleteBlog
);

Route.get(
    "/",
    Validate(IGetBlogsSchema),
    GetBlog
);

Route.get(
    "/:id",
    Validate(IGetBlogSchema),
    GetBlogById
);

export default Route;
import { verifyAdmin } from '@middleware/Auth.middleware';
import upload from '@middleware/Multer.middleware';
import express from 'express'
import { CreateBlog, UpdateBlog, DeleteBlog, GetBlog, GetBlogById } from './Blog.controller';
import { Validate } from '@middleware/Validation.middleware';
import { IBlogSchema, IGetBlogSchema, IGetBlogsSchema, IUpdateBlogSchema } from './Blog.validation';

const Route = express.Router();

Route.post(
    "/blogs",
    verifyAdmin,
    Validate(IBlogSchema),
    upload.single("image"),
    CreateBlog
);

Route.put(
    "/blogs/:id",
    verifyAdmin,
    Validate(IUpdateBlogSchema),
    upload.single("image"),
    UpdateBlog
);

Route.delete(
    "/blogs/:id",
    verifyAdmin,
    Validate(IGetBlogSchema),
    DeleteBlog
);

Route.get(
    "/blogs?page=:page&limit=:limit",
    Validate(IGetBlogsSchema),
    GetBlog
);

Route.get(
    "/blogs/:id",
    Validate(IGetBlogSchema),
    GetBlogById
);

export default Route;
import express from "express";
import { DeleteBlogImage, updateBlogImage, uploadToCloudinary } from "../middlewares/Blog.middleware.js";
import {CreateBlog, UpdateBlog, DeleteBlog, GetBlog} from '../Controller/blog.controller.js'
import  upload  from "../middlewares/multer.middleware.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Upload & Create Blog Route
router.post("/create",verifyAdmin ,upload.single('BlogImage'), uploadToCloudinary, CreateBlog);

// Other Routes
router.put("/update/:id",verifyAdmin,upload.single('BlogImage'),updateBlogImage, UpdateBlog);
router.post("/delete/:id",verifyAdmin,DeleteBlogImage, DeleteBlog);
router.get("/", GetBlog);

export default router;
import express from "express";
import { upload, uploadToCloudinary } from "../middlewares/Blog.middleware.js";
import {CreateBlog, UpdateBlog, DeleteBlog, GetBlog} from '../Controller/blog.controller.js'

const router = express.Router();

// Upload & Create Blog Route
router.post("/create" ,upload.single("image"), uploadToCloudinary, CreateBlog);

// Other Routes
router.put("/update/:_id", UpdateBlog);
router.delete("/delete/:_id", DeleteBlog);
router.get("/", GetBlog);

export default router;
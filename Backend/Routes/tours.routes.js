import express from 'express';
import { getTours, getToursData, MakeTour, UpdateTour,DeleteTour } from '../Controller/tours.controller.js';
import  upload  from '../middlewares/multer.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';
import { DeleteBlogImage, updateBlogImage, uploadToCloudinary } from '../middlewares/Blog.middleware.js';

const router=express.Router();

router.get('/',getTours);
router.get('/data/:_id',getToursData);
router.post('/',verifyAdmin,upload.single('images'),uploadToCloudinary,MakeTour);
router.put('/:id',verifyAdmin,upload.single('images'),updateBlogImage,UpdateTour);
router.post('/:id',verifyAdmin,DeleteBlogImage,DeleteTour);

export default router;
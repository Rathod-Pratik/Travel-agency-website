import express from 'express';
import { AddReview, GetReview,EditReview,DeleteReview, GetallReview } from '../Controller/review.controller.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';
const route=express.Router();

route.post('/',AddReview);
route.get('/',verifyAdmin,GetallReview);
route.get('/:_id',verifyAdmin,GetReview);
route.put('/:_id',verifyAdmin,EditReview);
route.post('/DeleteReview',verifyAdmin,DeleteReview);

export default route;
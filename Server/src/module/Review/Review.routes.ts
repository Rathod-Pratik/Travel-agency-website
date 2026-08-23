import express from 'express';
import { AddReview, DeleteReview, EditReview, GetReview } from './Review.Controller';
import { verifyAdmin } from '@middleware/Auth.middleware';
import { Validate } from '@middleware/Validation.middleware';
import { CreateReviewSchema, ReviewIdSchema, UpdateReviewSchema } from './Review.validation';
const route=express.Router();

route.post('/review?page=:page&limit=:limit',Validate(CreateReviewSchema),AddReview);
route.get('/review/:id',Validate(ReviewIdSchema),verifyAdmin,GetReview);
route.put('/review/:id',Validate(UpdateReviewSchema),verifyAdmin,EditReview);
route.delete('/review/:id',Validate(ReviewIdSchema),verifyAdmin,DeleteReview);

export default route;
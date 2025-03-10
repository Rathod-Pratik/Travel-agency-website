import express from 'express';
import { AddReview, GetReview,EditReview,DeleteReview } from '../Controller/review.controller.js';
const route=express.Router();

route.post('/',AddReview);
route.get('/:_id',GetReview);
route.put('/:_id',EditReview);
route.delete('/:_id',DeleteReview);

export default route;
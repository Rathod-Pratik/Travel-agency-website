import express from 'express';
import { AddReview, GetReview,EditReview,DeleteReview, GetallReview } from '../Controller/review.controller.js';
const route=express.Router();

route.post('/',AddReview);
route.get('/',GetallReview);
route.get('/:_id',GetReview);
route.put('/:_id',EditReview);
route.post('/DeleteReview',DeleteReview);

export default route;
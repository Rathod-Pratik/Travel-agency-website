import express from 'express';
import { AddReview, GetReview } from '../Controller/review.controller.js';
const route=express.Router();

route.post('/',AddReview);
route.get('/{_id}',GetReview);

export default route;
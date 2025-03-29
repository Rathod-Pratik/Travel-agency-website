import express from 'express';
import { CancelBooking, CreateBooking, GetAllBooking, GetAllCancelBooking, UpdateBooking, ViewBooking } from '../Controller/booking.controller.js';

const router=express.Router();

router.post('/',CreateBooking);
router.post('/ViewBooking',ViewBooking);
router.get('/user/:userId',GetAllBooking);
router.get('/user/cancel/:userId',GetAllCancelBooking);
router.put('/',UpdateBooking);
router.post('/:_id',CancelBooking);

export default router;
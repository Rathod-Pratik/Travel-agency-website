import express from 'express';
import { CancelBooking, CreateBooking, GetAllBooking, UpdateBooking, ViewBooking } from '../Controller/booking.controller.js';

const router=express.Router();

router.post('/',CreateBooking);
router.post('/ViewBooking',ViewBooking);
router.get('/user/:userId',GetAllBooking);
router.put('/',UpdateBooking);
router.delete('/:_id',CancelBooking);

export default router;
import express from 'express';
import { CancelBooking, CreateBooking, DeleteBookingData, GetAllBooking, GetAllBookingToAdmin, GetAllCancelBooking, UpdateBooking, ViewBooking } from '../Controller/booking.controller.js';

const router=express.Router();

router.post('/',CreateBooking);
router.post('/ViewBooking',ViewBooking);
router.get('/user/:userId',GetAllBooking);
router.get('/getallbooking',GetAllBookingToAdmin)
router.get('/user/cancel/:userId',GetAllCancelBooking);
router.put('/',UpdateBooking);
router.post('/:_id',CancelBooking);
router.delete('/deletebooking/:_id',DeleteBookingData)

export default router;
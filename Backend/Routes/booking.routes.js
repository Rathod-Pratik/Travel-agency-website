import express from 'express';
import { CancelBooking, CreateBooking, GetAllBooking, UpdateBooking, ViewBooking } from '../Controller/booking.controller.js';

const router=express.Router();

router.post('/',CreateBooking);
router.get('/{_id}',ViewBooking);
router.get('user/{userId}',GetAllBooking);
router.put('/{userId}',UpdateBooking);
router.delete('/{id}',CancelBooking);

export default router;
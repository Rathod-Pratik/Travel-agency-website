import express from 'express';
import { GetBookings, GetBookingDetails, CreateBooking, CancelBooking, AcceptBooking } from './Booking.controller';
import { verifyUser } from '@middleware/Auth.middleware';
import { Validate } from '@middleware/Validation.middleware';
import { BookingIdValidation, BookingValidation, CancelBookingValidation } from './Booking.validation';
const Route = express.Router();

Route.get('/', GetBookings); 
Route.get('/:tourId', verifyUser, Validate(BookingIdValidation), GetBookingDetails);
Route.post('/', verifyUser, Validate(BookingValidation), CreateBooking);
Route.post('/accept', verifyUser, Validate(BookingIdValidation), AcceptBooking);
Route.patch('/reject/:tourId?all=:all', verifyUser, Validate(CancelBookingValidation), CancelBooking);

export default Route;
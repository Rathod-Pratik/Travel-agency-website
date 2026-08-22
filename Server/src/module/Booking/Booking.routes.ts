import express from 'express';
import { GetBookings, GetBookingDetails, CreateBooking, UpdateBooking, CancelBooking } from './Booking.controller';
import { verifyUser } from '@middleware/Auth.middleware';
import { Validate } from '@middleware/Validation.middleware';
import { BookingIdValidation, BookingValidation, CancelBookingValidation } from './Booking.validation';
const Route = express.Router();

Route.get('/booking?page=:page&limit=:limit', verifyUser, GetBookings); 
Route.get('/booking/:tourId', verifyUser, Validate(BookingIdValidation), GetBookingDetails);
Route.post('/booking', verifyUser, Validate(BookingValidation), CreateBooking);
Route.put('/booking/:tourId', verifyUser, Validate(BookingIdValidation), UpdateBooking);
Route.patch('/booking/:tourId?all=:all', verifyUser, Validate(CancelBookingValidation), CancelBooking);

export default Route;
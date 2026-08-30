import express from "express";

import {
    CreateBooking,
    GetBookings,
    GetMyBookings,
    GetBookingDetails,
    CancelBooking
} from "./Booking.controller";

import {
    verifyAdmin,
    verifyUser
} from "@middleware/Auth.middleware";

import {
    Validate
} from "@middleware/Validation.middleware";

import {
    CreateBookingSchema,
    BookingIdSchema,
    CancelBookingSchema
} from "./Booking.validation";

const Route = express.Router();

Route.get(
    "/",
    verifyAdmin,
    GetBookings
);

Route.get(
    "/my",
    verifyUser,
    GetMyBookings
);

Route.get(
    "/:id",
    verifyUser,
    Validate(BookingIdSchema),
    GetBookingDetails
);

Route.post(
    "/",
    verifyUser,
    Validate(CreateBookingSchema),
    CreateBooking
);

Route.patch(
    "/:id/cancel",
    verifyUser,
    Validate(BookingIdSchema),
    Validate(CancelBookingSchema),
    CancelBooking
);

export default Route;
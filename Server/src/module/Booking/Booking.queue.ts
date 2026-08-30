import { Queue } from "bullmq";

import { bellmqConnection } from "@config/redis";

import {
    CreateBookingJobData,
    UpdateBookingStatusJobData,
    CancelBookingJobData,
    DeleteBookingJobData
} from "./Booking.types";

export const bookingCreationQueue =
    new Queue<CreateBookingJobData>(
        "booking-creation",
        {
            connection: bellmqConnection
        }
    );

export const bookingStatusQueue =
    new Queue<UpdateBookingStatusJobData>(
        "booking-status",
        {
            connection: bellmqConnection
        }
    );

export const bookingCancellationQueue =
    new Queue<CancelBookingJobData>(
        "booking-cancellation",
        {
            connection: bellmqConnection
        }
    );

export const bookingDeleteQueue =
    new Queue<DeleteBookingJobData>(
        "booking-delete",
        {
            connection: bellmqConnection
        }
    );
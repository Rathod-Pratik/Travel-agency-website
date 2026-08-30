import { Worker } from "bullmq";

import { bellmqConnection } from "@config/redis";

import BookingModel from "./Booking.model";

import {
    CreateBookingJobData,
    UpdateBookingStatusJobData,
    CancelBookingJobData,
    DeleteBookingJobData,
    TravellerDetails
} from "./Booking.types";

import {
    BookingCacheKeys,
    incrementCacheVersion
} from "@utils/index";

import { logger } from "@modules/log/logger";

import { Refund, VerifyPayment } from "@modules/Payment/Payment.controller";
import { invoiceGenerationQueue } from "@modules/Invoice/Invoice.queue";
import { AuthModel } from "@modules/Auth/Auth.model";
import { TourModel } from "@modules/Tour/Tour.model";

export const bookingCreateWorker =
    new Worker<CreateBookingJobData>(
        "booking-creation",

        async (job) => {

            const {
                requestId,
                bookingData
            } = job.data;

            logger.info(
                "Booking Worker: Processing booking creation job",
                {
                    metadata: {
                        requestId,
                        bookingData
                    }
                }
            );

            const existingBooking =
                await BookingModel.findOne({
                    invoiceNumber: bookingData.invoiceNumber
                });

            if (existingBooking) {

                logger.warn(
                    "Booking creation failed - booking already exists",
                    {
                        metadata: {
                            requestId,
                            bookingId: existingBooking._id
                        }
                    }
                );

                return {
                    bookingId: existingBooking._id,
                    alreadyExists: true
                };
            }

            const paymentVerification =
                await VerifyPayment(
                    bookingData.paymentId,
                    bookingData.userId,
                    bookingData.tourId,
                    bookingData.amount
                );

            if (paymentVerification.status !== "Completed") {
                return {
                    success: false,
                    message: paymentVerification.message
                }
            }



            const booking =
                await BookingModel.create({
                    invoiceNumber: bookingData.invoiceNumber,

                    userId: bookingData.userId,

                    tourId: bookingData.tourId,

                    noOfSeats:
                        bookingData.noOfSeats,

                    travellerDetails:
                        bookingData.travellerDetails,

                    amount:
                        bookingData.amount,

                    paymentId:
                        bookingData.paymentId,

                    status: "Booked",

                    isDeleted: false
                });

            await incrementCacheVersion(
                BookingCacheKeys.listVersion()
            );

            await incrementCacheVersion(
                BookingCacheKeys.detailsVersion(
                    booking._id.toString()
                )
            );

            const user = await AuthModel.findOne({ _id: booking.userId });
            if (!user) {
                logger.warn(
                    "Booking Worker: User not found for booking",
                    {
                        metadata: {
                            requestId,
                            bookingId: booking._id,
                            userId: booking.userId
                        }
                    }
                );
                throw new Error(
                    `User not found for booking ${booking._id}`
                );
            }
            const tour = await TourModel.findOne({ _id: booking.tourId });
            if (!tour) {
                logger.warn(
                    "Booking Worker: Tour not found for booking",
                    {
                        metadata: {
                            requestId,
                            bookingId: booking._id,
                            tourId: booking.tourId
                        }
                    }
                );
                throw new Error(
                    `Tour not found for booking ${booking._id}`
                );
            }
            const travellerDetails = booking.travellerDetails.map((traveller: TravellerDetails) => ({
                name: traveller.name,
                age: traveller.age,
                document: traveller.document
            }));

            const data = {
                invoiceNumber: booking.invoiceNumber,
                invoiceDate: booking.date.toISOString(),
                booking: {
                    bookingDate: booking.date.toISOString(),
                    status: booking.status,
                    numberOfSeats: booking.noOfSeats
                },
                customer: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                },
                traveller: travellerDetails,
                tour: {
                    name: tour.title,
                    destination: {
                        city: tour.destination.city,
                        country: tour.destination.country
                    },
                    startDate: tour.startDate.toISOString(),
                    endDate: tour.endDate.toISOString(),
                    duration: {
                        days: tour.duration.days,
                        nights: tour.duration.nights
                    },
                },
                payment: {
                    paymentId: booking.paymentId.toString(),
                    paymentMethod: paymentVerification.method,
                    status: paymentVerification.status,
                },
                amount: booking.amount,
                code: booking.code,
                company: {
                    name: "TravelWorld",
                    email: "info@travelworld.com",
                    phone: "+1234567890",
                    address: "123 Main Street, City, Country",
                    website: "https://www.travelworld.com"
                }
            }

            const invoiceJob =
                await invoiceGenerationQueue.add(
                    "invoice-generation",
                    data,
                    {
                        attempts: 5,

                        backoff: {
                            type: "exponential",
                            delay: 5000
                        },

                        removeOnComplete: {
                            age: 3600
                        },

                        removeOnFail: {
                            age: 86400
                        }
                    }
                );

            logger.info(
                "Booking Worker: Booking created successfully",
                {
                    metadata: {
                        requestId,
                        bookingId: booking._id,
                        userId: booking.userId
                    }
                }
            );

            return {
                success: true,

                bookingId:
                    booking._id,

                invoiceJobId:
                    invoiceJob.id,

                alreadyExists: false
            };
        },

        {
            connection: bellmqConnection,
            concurrency: 5
        }
    );

export const bookingCancellationWorker =
    new Worker<CancelBookingJobData>(
        "booking-cancellation",

        async (job) => {

            const {
                requestId,
                bookingId,
                cancelledBy,
                reason,
                description,
                refundAmount,
                refundStatus,
                userId
            } = job.data;

            const booking =
                await BookingModel.findOne({
                    _id: bookingId,
                    isDeleted: false
                });

            if (!booking) {

                logger.warn(
                    "Booking cancellation failed - booking not found",
                    {
                        metadata: {
                            requestId,
                            bookingId
                        }
                    }
                );

                return {
                    bookingId,
                    cancelled: false
                };
            }

            if (booking.status === "Cancelled") {

                logger.warn(
                    "Booking cancellation failed - booking already cancelled",
                    {
                        metadata: {
                            requestId,
                            bookingId
                        }
                    }
                );

                return {
                    bookingId,
                    cancelled: false,
                    alreadyCancelled: true
                };
            }

            await Refund({ paymentId: booking.paymentId.toString(), userId });
            booking.status = "Cancelled";

            booking.cancellation = {
                reason,
                description,
                cancelledBy: userId,
                cancelledAt: new Date(),
                refundAmount,
                refundStatus
            };

            await booking.save();

            await incrementCacheVersion(
                BookingCacheKeys.listVersion()
            );

            await incrementCacheVersion(
                BookingCacheKeys.detailsVersion(
                    bookingId
                )
            );

            logger.info(
                "Booking cancelled successfully",
                {
                    metadata: {
                        requestId,
                        bookingId,
                        cancelledBy,
                        refundAmount,
                        refundStatus
                    }
                }
            );

            return {
                bookingId,
                cancelled: true
            };
        },

        {
            connection: bellmqConnection,
            concurrency: 5
        }
    );
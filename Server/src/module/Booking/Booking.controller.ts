import { Request, Response } from "express";
import crypto from "crypto";

import BookingModel from "./Booking.model";

import {
    bookingCreationQueue,
    bookingCancellationQueue,
} from "./Booking.queue";

import {
    BookingCacheKeys,
    getCache,
    getCacheVersion,
    setCache
} from "@utils/index";

import { logger } from "@modules/log/logger";
import { createNotification } from "@modules/Notification/Notification.service";

export const CreateBooking = async (
    req: Request,
    res: Response
) => {

    const {
        userId,
        tourId,
        noOfSeats,
        travellerDetails,
        date,
        amount,
        paymentId
    } = req.body;
    const code =
        `BOOK-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
            1000 + Math.random() * 9000
        )}`;

    const requestId =
        crypto.randomUUID();
    try {
        const invoiceNumber =
            `INV-${Date.now()}-${Math.floor(
                Math.random() * 1000
            )}`;
        const job =
            await bookingCreationQueue.add(
                "booking-creation",
                {
                    requestId,
                    userId,
                    bookingData: {
                        code,
                        invoiceNumber,
                        userId,
                        tourId,
                        noOfSeats,
                        travellerDetails,
                        date,
                        amount,
                        paymentId
                    }
                },
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
            "Booking creation job added to queue",
            {
                metadata: {
                    requestId,
                    jobId: job.id,
                    userId,
                    tourId
                }
            }
        );
        await createNotification({
            userId: req.body.id,
            message: "Blog creation is being processed",
            type: "info",
        });
        return res.status(202).json({
            success: true,
            message: "Booking creation is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (error) {
        createNotification({
            userId: req.body.id,
            message: "Error creating booking",
            type: "error",
        });
        logger.error(
            "Error creating booking",
            {
                metadata: {
                    requestId,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );
 await createNotification({
            userId: req.body?.id,
            message: `Your request to create booking failed.`,
            type: "error"
        });
        return res.status(500).json({
            success: false,
            message: "Error creating booking"
        });
    }
};

export const GetBookings = async (
    req: Request,
    res: Response
) => {

    try {

        let page =
            Number(req.query.page) || 1;

        let limit =
            Number(req.query.limit) || 10;

        if (page < 1) {
            page = 1;
        }

        if (limit < 1) {
            limit = 10;
        }

        if (limit > 100) {
            limit = 100;
        }

        const version =
            await getCacheVersion(
                BookingCacheKeys.listVersion()
            );

        const cacheKey =
            BookingCacheKeys.list(
                version,
                page,
                limit
            );

        const cachedBookings =
            await getCache(cacheKey);

        if (cachedBookings) {

            return res.status(200).json({
                success: true,
                source: "redis",
                data: cachedBookings
            });
        }

        const bookings =
            await BookingModel
                .find({
                    isDeleted: false
                })
                .populate("tourId")
                .populate("userId")
                .populate("paymentId")
                .sort({
                    createdAt: -1
                })
                .skip(
                    (page - 1) * limit
                )
                .limit(limit)
                .lean();

        const total =
            await BookingModel.countDocuments({
                isDeleted: false
            });

        const responseData = {
            bookings,
            pagination: {
                page,
                limit,
                total,
                totalPages:
                    Math.ceil(total / limit)
            }
        };

        await setCache(
            cacheKey,
            responseData,
            300
        );

        return res.status(200).json({
            success: true,
            source: "mongodb",
            data: responseData
        });

    } catch (error) {

        logger.error(
            "Error fetching bookings",
            {
                metadata: {
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );

        return res.status(500).json({
            success: false,
            message: "Error fetching bookings"
        });
    }
};


export const GetMyBookings = async (
    req: Request,
    res: Response
) => {

    const { userId } = req.params as { userId: string };

    try {

        let page =
            Number(req.query.page) || 1;

        let limit =
            Number(req.query.limit) || 10;

        if (page < 1) {
            page = 1;
        }

        if (limit < 1) {
            limit = 10;
        }

        if (limit > 100) {
            limit = 100;
        }

        const version =
            await getCacheVersion(
                BookingCacheKeys.listVersion()
            );

        const cacheKey =
            BookingCacheKeys.list(
                version,
                page,
                limit,
                userId
            );

        const cachedBookings =
            await getCache(cacheKey);

        if (cachedBookings) {

            return res.status(200).json({
                success: true,
                source: "redis",
                data: cachedBookings
            });
        }

        const bookings =
            await BookingModel
                .find({
                    userId,
                    isDeleted: false
                })
                .populate("tourId")
                .populate("paymentId")
                .sort({
                    createdAt: -1
                })
                .skip(
                    (page - 1) * limit
                )
                .limit(limit)
                .lean();

        const total =
            await BookingModel.countDocuments({
                userId,
                isDeleted: false
            });

        const responseData = {
            bookings,
            pagination: {
                page,
                limit,
                total,
                totalPages:
                    Math.ceil(total / limit)
            }
        };

        await setCache(
            cacheKey,
            responseData,
            300
        );

        return res.status(200).json({
            success: true,
            source: "mongodb",
            data: responseData
        });

    } catch (error) {

        logger.error(
            "Error fetching user bookings",
            {
                metadata: {
                    userId,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );

        return res.status(500).json({
            success: false,
            message: "Error fetching bookings"
        });
    }
};


export const GetBookingDetails = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params as { id: string };

    try {

        const version =
            await getCacheVersion(
                BookingCacheKeys.detailsVersion(id)
            );

        const cacheKey =
            BookingCacheKeys.details(
                id,
                version
            );

        const cachedBooking =
            await getCache(cacheKey);

        if (cachedBooking) {

            return res.status(200).json({
                success: true,
                source: "redis",
                data: cachedBooking
            });
        }

        const booking =
            await BookingModel
                .findOne({
                    _id: id,
                    isDeleted: false
                })
                .populate("tourId")
                .populate("userId")
                .populate("paymentId")
                .lean();

        if (!booking) {

            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        await setCache(
            cacheKey,
            booking,
            300
        );

        return res.status(200).json({
            success: true,
            source: "mongodb",
            data: booking
        });

    } catch (error) {

        logger.error(
            "Error fetching booking details",
            {
                metadata: {
                    bookingId: id,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );

        return res.status(500).json({
            success: false,
            message: "Error fetching booking"
        });
    }
};

export const CancelBooking = async (
    req: Request,
    res: Response
) => {

    const { id } = req.params as { id: string };

    const {
        reason,
        description,
        refundAmount,
        refundStatus
    } = req.body;

    const cancelledBy = req.body.id;

    const requestId =
        crypto.randomUUID();

    try {

        const booking =
            await BookingModel.findOne({
                _id: id,
                isDeleted: false
            });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.status === "Cancelled") {

            return res.status(400).json({
                success: false,
                message: "Booking is already cancelled"
            });
        }

        const job =
            await bookingCancellationQueue.add(
                "booking-cancellation",
                {
                    requestId,
                    bookingId: id,
                    cancelledBy,
                    reason,
                    description,
                    refundAmount,
                    refundStatus,
                    userId: req.body.id
                },
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

        createNotification({
            userId: req.body.id,
            message: "Booking cancellation is being processed",
            type: "info",
        });
        return res.status(202).json({
            success: true,
            message: "Booking cancellation is being processed",
            data: {
                jobId: job.id,
                requestId
            }
        });

    } catch (error) {

        logger.error(
            "Error cancelling booking",
            {
                metadata: {
                    bookingId: id,
                    requestId,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );
 await createNotification({
            userId: req.body?.id,
            message: `Your request to cancel booking failed.`,
            type: "error"
        });
        return res.status(500).json({
            success: false,
            message: "Error cancelling booking"
        });
    }
};
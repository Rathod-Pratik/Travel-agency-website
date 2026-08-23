import { Request, Response } from 'express';
import BookingModel from './Booking.model';
import { AuthModel } from '@modules/Auth/Auth.model';
import { TourModel } from '@modules/Tour/Tour.model';
import { BookingCacheKeys, getCacheVersion, getCache, setCache, incrementCacheVersion, uploadFileToS3 } from '@utils/index';
import { logger } from '@modules/log/logger';

export const GetBookings = async (req: Request, res: Response) => {
    try {
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;
        if (page < 1) {
            page = 1;
        }
        if (limit < 1) {
            limit = 10;
        }
        if (limit > 100) {
            limit = 100;
        }
        const version = await getCacheVersion(BookingCacheKeys.listVersion());
        const cacheKey = BookingCacheKeys.list(version, page, limit);
        const cachedData = await getCache(cacheKey);
        if (cachedData) {

            logger.info("Bookings fetched from cache", {
                metadata: {
                    page,
                    limit,
                    source: "cache"
                }
            });

            return res.status(200).json({
                success: true,
                message: "Bookings fetched successfully",
                data: cachedData,
            })
        }

        const bookings = await BookingModel.find({ isDeleted: false }).skip((Number(page) - 1) * Number(limit)).limit(Number(limit));
        await setCache(cacheKey, bookings, 1800);

        logger.info("Bookings fetched from database", {
            metadata: {
                count: bookings.length,
                page,
                limit,
                source: "database"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            data: bookings
        })
    } catch (err) {

        logger.error("Error fetching bookings", {
            metadata: {
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error fetching bookings",
            data: err
        })
    }
}

export const GetBookingDetails = async (req: Request, res: Response) => {
    try {
        const { tourId } = req.params;
        const version = await getCacheVersion(BookingCacheKeys.detailsVersion(tourId as string));
        const cacheKey = BookingCacheKeys.details(tourId as string, version);
        const cachedData = await getCache(cacheKey);

        if (cachedData) {

            logger.info("Booking fetched from cache", {
                metadata: {
                    bookingId: tourId,
                    source: "cache"
                }
            });

            return res.status(200).json({
                success: true,
                message: "Booking fetched successfully",
                data: cachedData,
            })
        }

        const booking = await BookingModel.findById(tourId);

        if (!booking) {

            logger.warn("Booking not found", {
                metadata: {
                    bookingId: tourId
                }
            });

            return res.status(404).json({
                success: false,
                message: "Booking not found"
            })
        }

        await setCache(cacheKey, booking, 1800);

        logger.info("Booking details fetched from database", {
            metadata: {
                bookingId: tourId,
                source: "database"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Booking fetched successfully",
            data: booking
        })
    } catch (err) {

        logger.error("Error fetching booking details", {
            metadata: {
                bookingId: req.params.tourId,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error fetching booking details",
            data: err
        })
    }
}

export const CreateBooking = async (req: Request, res: Response) => {
    try {
        const { id, tourId, travellerDetails, date, amount, paymentId, status } = req.body;

        travellerDetails.forEach(async (traveller: any) => {
            const uploadedFile = await uploadFileToS3({
                buffer: traveller.buffer,
                fileName: traveller.originalname,
                fileType: traveller.mimetype,
                folderType: `booking/${id}/${tourId}/travellerDocuments`,
            });

            traveller.image = uploadedFile.url;
        })

        const booking = await BookingModel.create({
            userId: id,
            tourId,
            travellerDetails,
            date,
            amount,
            paymentId,
            status
        });

        await incrementCacheVersion(BookingCacheKeys.listVersion());

        logger.info("Booking created successfully", {
            metadata: {
                bookingId: booking._id.toString(),
                userId: id,
                tourId,
                amount,
                status
            }
        });

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking
        });
    } catch (err) {

        logger.error("Error creating booking", {
            metadata: {
                userId: req.body.id,
                tourId: req.body.tourId,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error creating booking",
            data: err
        });
    }
};

export const UpdateBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const { userId, tourId, travellerDetails, date, amount, paymentId, status } = req.body;

        const booking = await BookingModel.findByIdAndUpdate(id, {
            userId,
            tourId,
            travellerDetails,
            date,
            amount,
            paymentId,
            status
        }, { new: true });

        if (!booking) {

            logger.warn("Booking update failed - booking not found", {
                metadata: {
                    bookingId: id
                }
            });

            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        await incrementCacheVersion(BookingCacheKeys.detailsVersion(tourId as string));

        logger.info("Booking updated successfully", {
            metadata: {
                bookingId: id,
                userId,
                tourId,
                status
            }
        });

        return res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            data: booking
        });
    } catch (err) {

        logger.error("Error updating booking", {
            metadata: {
                bookingId: req.body.id,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error updating booking",
            data: err
        });
    }
};

export const CancelBooking = async (req: Request, res: Response) => {
    try {
        const { all } = req.params;
        const { id, tourId, reason, description, cancelledBy, refundAmount, refundStatus } = req.body;

        const user = await AuthModel.findById(id);

        if (!user) {

            logger.warn("Booking cancellation failed - user not found", {
                metadata: {
                    userId: id,
                    bookingId: tourId
                }
            });

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let booking;

        if (user.role === "Admin") {

            if (all === "true") {

                booking = await BookingModel.updateMany({ tourId: tourId }, {
                    status: "cancelled", cancellation: {
                        reason: reason,
                        description: description,
                        cancelledBy: cancelledBy,
                        refundAmount: refundAmount,
                        refundStatus: refundStatus
                    }
                });

                await TourModel.findByIdAndUpdate(tourId, { status: "Cancelled" });

                await BookingModel.updateMany(
                    { tourId: tourId },
                    { status: "cancelled" }
                );

            } else {

                booking = await BookingModel.findByIdAndUpdate(tourId, {
                    status: "cancelled", cancellation: {
                        reason: reason,
                        description: description,
                        cancelledBy: cancelledBy,
                        refundAmount: refundAmount,
                        refundStatus: refundStatus
                    }
                }, { new: true });

                if (!booking) {

                    logger.warn("Booking cancellation failed - booking not found", {
                        metadata: {
                            bookingId: tourId,
                            userId: id
                        }
                    });

                    return res.status(404).json({
                        success: false,
                        message: "Booking not found"
                    });
                }

                await TourModel.findByIdAndUpdate(
                    tourId,
                    {
                        $inc: {
                            seatsAvailable: booking.noOfSeats
                        }
                    }
                );
            }

        } else if (user.role === "User") {

            booking = await BookingModel.findByIdAndUpdate(tourId, {
                status: "cancelled", cancellation: {
                    reason: reason,
                    description: description,
                    cancelledBy: cancelledBy,
                    refundAmount: refundAmount,
                    refundStatus: refundStatus
                }
            }, { new: true });

            if (!booking) {

                logger.warn("Booking cancellation failed - booking not found", {
                    metadata: {
                        bookingId: tourId,
                        userId: id
                    }
                });

                return res.status(404).json({
                    success: false,
                    message: "Booking not found"
                });
            }

            await TourModel.findByIdAndUpdate(
                tourId,
                {
                    $inc: {
                        seatsAvailable: booking.noOfSeats
                    }
                }
            );
        }

        await incrementCacheVersion(BookingCacheKeys.listVersion());
        await incrementCacheVersion(BookingCacheKeys.detailsVersion(tourId as string));

        logger.info("Booking cancelled successfully", {
            metadata: {
                bookingId: tourId,
                userId: id,
                role: user.role,
                cancelledBy,
                refundAmount,
                refundStatus,
                all
            }
        });

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking
        });
    } catch (err) {

        logger.error("Error cancelling booking", {
            metadata: {
                userId: req.body.id,
                bookingId: req.body.tourId,
                refundStatus: req.body.refundStatus,
                error: err instanceof Error
                    ? err.message
                    : String(err)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Error cancelling booking",
            data: err
        });
    }
};
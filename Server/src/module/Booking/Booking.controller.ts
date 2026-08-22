import { Request, Response } from 'express';
import BookingModel from './Booking.model';
import { AuthModel } from '@modules/Auth/Auth.model';

export const GetBookings = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const bookings = await BookingModel.find().skip((Number(page) - 1) * Number(limit)).limit(Number(limit));
        const totalBookings = await BookingModel.countDocuments();
        const totalPages = Math.ceil(totalBookings / Number(limit));
        return res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            data: bookings,
            totalPages: totalPages,
            currentPage: Number(page)
        })
    } catch (err) {
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
        const booking = await BookingModel.findById(tourId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Booking fetched successfully",
            data: booking
        })
    } catch (err) {
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
        const booking = await BookingModel.create({
            userId: id,
            tourId,
            travellerDetails,
            date,
            amount,
            paymentId,
            status
        });
        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking
        });
    } catch (err) {
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
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            data: booking
        });
    } catch (err) {
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
        const { id,tourId, reason, description, cancelledBy, refundAmount, refundStatus } = req.body;

        const user = await AuthModel.findById(id);
        if (!user) {
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
        }

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error cancelling booking",
            data: err
        });
    }
};
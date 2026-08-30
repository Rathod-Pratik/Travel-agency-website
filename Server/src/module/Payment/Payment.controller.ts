import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Request, Response } from 'express';
import { PaymentModel } from './Payment.model';
import { logger } from '@modules/log/logger';
import { AuthModel } from '@modules/Auth/Auth.model';
import ca from 'zod/v4/locales/ca.js';
import mongoose from 'mongoose';

const keyId = process.env.RAZORPAY_API_KEY;
const keySecret = process.env.RAZORPAY_API_SECRET;

if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are missing");
}

export const razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret
});

export const createOrder = async (req: Request, res: Response) => {
    try {
        const {
            userId,
            tourId,
            amount,
            currency = 'INR',
            receipt
        } = req.body;

        const amountInPaise = Math.round(amount * 100);

        if (amountInPaise < 100) {

            logger.warn("Payment order creation failed - invalid amount", {
                metadata: {
                    userId,
                    tourId,
                    amount
                }
            });

            return res.status(400).json({
                error: "Amount must be at least ₹1 (100 paise)"
            });
        }

        const options = {
            amount: amountInPaise.toString(),
            currency,
            receipt,
            payment_capture: 1
        };

        const order = await razorpayInstance.orders.create(options);

        const paymentData = {
            userId,
            tourId,
            amount: amountInPaise,
            currency,
            razorpayOrderId: order.id,
            status: "Pending",
            createdAt: new Date()
        };

        const payment = await PaymentModel.create(paymentData);

        if (!payment) {

            logger.error("Payment record creation failed", {
                metadata: {
                    userId,
                    tourId,
                    razorpayOrderId: order.id
                }
            });

            return res.status(500).json({
                success: false,
                message: "Failed to create payment record"
            });
        } else {

            logger.info("Razorpay order created successfully", {
                metadata: {
                    paymentId: payment._id.toString(),
                    userId,
                    tourId,
                    razorpayOrderId: order.id,
                    amount: amountInPaise,
                    currency,
                    status: "Pending"
                }
            });

            res.status(201).json({
                success: true,
                order,
                key: process.env.RAZERPAY_API_KEY
            });
        }

    } catch (error) {

        logger.error("Razorpay order creation error", {
            metadata: {
                userId: req.body.userId,
                tourId: req.body.tourId,
                error: error instanceof Error
                    ? error.message
                    : String(error)
            }
        });

        res.status(500).json({
            success: false,
            message: "Error creating order",
            error: error || "Internal Server Error"
        });
    }
};

export const verifyOrder = async (req: Request, res: Response) => {
    try {

        const {
            orderId,
            paymentId,
            signature
        } = req.body;

        const key_secret = process.env.RAZERPAY_API_SECRET;

        if (!key_secret) {

            logger.error("Razorpay secret key not configured");

            return res.status(500).json({
                success: false,
                message: "Server error: Razorpay secret key not found"
            });
        }

        const hmac = crypto.createHmac(
            "sha256",
            key_secret
        );

        hmac.update(
            orderId + "|" + paymentId
        );

        const generated_signature = hmac.digest("hex");

        if (generated_signature === signature) {

            const payment = await PaymentModel.findOneAndUpdate(
                {
                    razorpayOrderId: orderId
                },
                {
                    razorpayPaymentId: paymentId,
                    razorpaySignature: signature,
                    status: "Completed"
                },
                {
                    new: true
                }
            );

            if (!payment) {

                logger.warn("Payment verification failed - payment record not found", {
                    metadata: {
                        orderId,
                        paymentId
                    }
                });

                return res.status(404).json({
                    success: false,
                    message: "Payment record not found"
                });

            } else {

                logger.info("Payment verified successfully", {
                    metadata: {
                        paymentId: payment._id.toString(),
                        userId: payment.userId,
                        tourId: payment.tourId,
                        razorpayOrderId: orderId,
                        razorpayPaymentId: paymentId,
                        status: "Completed"
                    }
                });

                return res.status(200).json({
                    success: true,
                    message: "Payment has been verified"
                });
            }

        } else {

            logger.warn("Payment verification failed - invalid signature", {
                metadata: {
                    orderId,
                    paymentId
                }
            });

            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

    } catch (error) {

        logger.error("Payment verification error", {
            metadata: {
                orderId: req.body.orderId,
                paymentId: req.body.paymentId,
                error: error instanceof Error
                    ? error.message
                    : String(error)
            }
        });

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error || "Internal Server Error"
        });
    }
};

export const Refund = async (
    { paymentId, userId }: { paymentId: string; userId: mongoose.Types.ObjectId }
) => {
    const user = await AuthModel.findById(userId);
    if (!user) {

        logger.warn(
            "Refund failed - user not found",
            {
                metadata: {
                    paymentId,
                    userId
                }
            }
        );

        return {
            success: false,
            message: "User not found"
        };
    }
    try {

        const paymentRecord =
            await PaymentModel.findOne({
                _id: paymentId, status
                    : "Completed"
            });

        if (!paymentRecord) {

            logger.warn(
                "Refund failed - payment record not found",
                {
                    metadata: {
                        paymentId
                    }
                }
            );

            return {
                success: false,
                message: "Payment record not found"
            };
        }

        if (!paymentRecord.razorpayPaymentId) {

            logger.warn(
                "Refund failed - Razorpay payment ID not found",
                {
                    metadata: {
                        paymentId
                    }
                }
            );

            return {
                success: false,
                message: "Razorpay payment ID not found"
            };
        }

        if (
            paymentRecord.status === "Refunded"
        ) {

            return {
                success: false,
                message: "Payment has already been refunded"
            };
        }

        const razorpayPayment =
            await razorpayInstance.payments.fetch(
                paymentRecord.razorpayPaymentId
            );

        if (
            !razorpayPayment ||
            typeof razorpayPayment.amount !== "number"
        ) {

            logger.warn(
                "Refund failed - invalid Razorpay payment",
                {
                    metadata: {
                        paymentId,
                        razorpayPaymentId:
                            paymentRecord.razorpayPaymentId
                    }
                }
            );

            return {
                success: false,
                message: "Invalid Razorpay payment details"
            };
        }

        const databaseAmount =
            Number(paymentRecord.amount);

        const razorpayAmount =
            Number(razorpayPayment.amount);

        if (
            !Number.isFinite(databaseAmount) ||
            !Number.isFinite(razorpayAmount)
        ) {

            return {
                success: false,
                message: "Invalid payment amount"
            };
        }

        if (
            databaseAmount !== razorpayAmount
        ) {

            logger.error(
                "Refund blocked - payment amount mismatch",
                {
                    metadata: {
                        paymentId,
                        databaseAmount,
                        razorpayAmount
                    }
                }
            );

            return {
                success: false,
                message:
                    "Payment amount mismatch. Refund blocked."
            };
        }



        const refundPercentage =
            user.role === "admin"
                ? 100
                : 80;

        const refundAmount =
            Math.floor(
                razorpayAmount *
                refundPercentage /
                100
            );

        if (refundAmount < 100) {

            logger.warn(
                "Refund failed - refund amount below Razorpay minimum",
                {
                    metadata: {
                        paymentId,
                        refundAmount,
                        refundPercentage
                    }
                }
            );

            return {
                success: false,
                message:
                    "Refund amount must be at least INR 1.00"
            };
        }

        const refund =
            await razorpayInstance.payments.refund(
                paymentRecord.razorpayPaymentId,
                {
                    amount: refundAmount
                }
            );

        const updatedPayment =
            await PaymentModel.findByIdAndUpdate(
                paymentRecord._id,
                {
                    status: "Refunded"
                },
                {
                    new: true
                }
            );

        if (!updatedPayment) {

            logger.error(
                "Refund completed but payment record update failed",
                {
                    metadata: {
                        paymentId,
                        refundAmount
                    }
                }
            );

            return {
                success: false,
                message:
                    "Refund completed but payment record could not be updated",
                refund
            };
        }

        logger.info(
            "Payment refunded successfully",
            {
                metadata: {
                    paymentId,
                    razorpayPaymentId:
                        paymentRecord.razorpayPaymentId,
                    userId: paymentRecord.userId,
                    tourId: paymentRecord.tourId,
                    originalAmount: razorpayAmount,
                    refundPercentage,
                    refundAmount,
                    cancelledBy: user.role,
                    status: "Refunded"
                }
            }
        );

        return {
            success: true,
            message: "Refund initiated successfully",
            refund,
            cancelledBy: user.role,
            refundAmount,
            refundPercentage,
            originalAmount: razorpayAmount,
            updatedPayment
        };

    } catch (error) {

        logger.error(
            "Razorpay refund error",
            {
                metadata: {
                    paymentId,
                    cancelledBy: user.role,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Refund failed"
        };
    }
};

export const GetPaymentHistory = async (
    req: Request,
    res: Response
) => {
    try {

        const {
            page = 1,
            limit = 10
        } = req.query;

        const payments = await PaymentModel.find()
            .skip(
                (Number(page) - 1) * Number(limit)
            )
            .limit(Number(limit));

        if (!payments || payments.length === 0) {

            logger.warn("No payment history found", {
                metadata: {
                    page,
                    limit
                }
            });

            return res.status(404).json({
                message: "No payment history found"
            });
        }

        logger.info("Payment history retrieved", {
            metadata: {
                count: payments.length,
                page,
                limit
            }
        });

        res.status(200).json(payments);

    } catch (error) {

        logger.error("Payment history error", {
            metadata: {
                page: req.query.page,
                limit: req.query.limit,
                error: error instanceof Error
                    ? error.message
                    : String(error)
            }
        });

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const VerifyPayment = async (
    paymentId: string,
    userId: string,
    tourId: string,
    amount: number
) => {

    try {

        const paymentRecord =
            await PaymentModel.findOne({
                _id: paymentId,
                userId,
                tourId
            });

        if (!paymentRecord) {

            return {
                success: false,
                message: "Payment record not found"
            };
        }

        if (!paymentRecord.razorpayPaymentId) {

            return {
                success: false,
                message: "Razorpay payment ID not found"
            };
        }

        if (paymentRecord.status !== "Completed") {

            return {
                success: false,
                message: "Payment is not completed"
            };
        }

        const razorpayPayment =
            await razorpayInstance.payments.fetch(
                paymentRecord.razorpayPaymentId
            );

        if (!razorpayPayment) {

            return {
                success: false,
                message: "Razorpay payment not found"
            };
        }

        if (
            razorpayPayment.status !== "captured"
        ) {

            return {
                success: false,
                message:
                    "Razorpay payment is not captured"
            };
        }

        const databaseAmount =
            Number(paymentRecord.amount);

        const razorpayAmount =
            Number(razorpayPayment.amount);

        const bookingAmount =
            Number(amount);

        if (
            databaseAmount !== razorpayAmount
        ) {

            logger.error(
                "Payment verification failed - database and Razorpay amount mismatch",
                {
                    metadata: {
                        paymentId,
                        databaseAmount,
                        razorpayAmount
                    }
                }
            );

            return {
                success: false,
                message:
                    "Payment amount mismatch"
            };
        }

        if (
            databaseAmount !== bookingAmount
        ) {

            logger.error(
                "Payment verification failed - booking amount mismatch",
                {
                    metadata: {
                        paymentId,
                        databaseAmount,
                        bookingAmount
                    }
                }
            );

            return {
                success: false,
                message:
                    "Booking amount does not match payment amount"
            };
        }

        return {
            success: true,
            status: paymentRecord.status,
            message: "Payment verified successfully",
            payment: paymentRecord,
            method: razorpayPayment.method
        };

    } catch (error) {

        logger.error(
            "Payment verification error",
            {
                metadata: {
                    paymentId,
                    userId,
                    tourId,
                    error:
                        error instanceof Error
                            ? error.message
                            : String(error)
                }
            }
        );

        return {
            success: false,
            message: "Payment verification failed"
        };
    }
};
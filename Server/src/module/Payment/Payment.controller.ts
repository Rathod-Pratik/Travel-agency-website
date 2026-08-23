import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Request, Response } from 'express';
import { PaymentModel } from './Payment.model';
import { logger } from '@modules/log/logger';

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

export const Refund = async (req: Request, res: Response) => {
    try {

        const {
            payment_id,
            amount
        } = req.body;

        const payment =
            await razorpayInstance.payments.fetch(payment_id);

        if (!payment || !payment.amount) {

            logger.warn("Refund failed - invalid payment details", {
                metadata: {
                    paymentId: payment_id
                }
            });

            return res.status(400).json({
                success: false,
                message: "Invalid payment details or missing amount"
            });
        }

        const refundAmount =
            amount || payment.amount;

        if (refundAmount < 100) {

            logger.warn("Refund failed - invalid refund amount", {
                metadata: {
                    paymentId: payment_id,
                    refundAmount
                }
            });

            return res.status(400).json({
                success: false,
                message: "The refund amount must be at least INR 1.00",
            });
        }

        const refund =
            await razorpayInstance.payments.refund(
                payment_id,
                {
                    amount: refundAmount
                }
            );

        const updatedPayment =
            await PaymentModel.findOneAndUpdate(
                {
                    razorpayPaymentId: payment_id
                },
                {
                    status: "Refunded"
                },
                {
                    new: true
                }
            );

        if (!updatedPayment) {

            logger.warn("Refund completed but payment record not found", {
                metadata: {
                    paymentId: payment_id,
                    refundAmount
                }
            });

            return res.status(404).json({
                success: false,
                message: "Payment record not found for refund"
            });

        } else {

            logger.info("Payment refunded successfully", {
                metadata: {
                    paymentId: payment_id,
                    paymentRecordId: updatedPayment._id.toString(),
                    userId: updatedPayment.userId,
                    tourId: updatedPayment.tourId,
                    refundAmount,
                    status: "Refunded"
                }
            });

            res.json({
                success: true,
                message: "Refund initiated successfully!",
                refund,
                updatedPayment,
            });
        }

    } catch (error) {

        logger.error("Razorpay refund error", {
            metadata: {
                paymentId: req.body.payment_id,
                refundAmount: req.body.amount,
                error: error instanceof Error
                    ? error.message
                    : String(error)
            }
        });

        res.status(500).json({
            success: false,
            message: error || "Refund failed"
        });
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
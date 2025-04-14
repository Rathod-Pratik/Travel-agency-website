import crypto from 'crypto';
import { razorpayInstance } from '../index.js';
import Razorpay from 'razorpay';

export const createOrder = async (req, res) => {
  try {
      const { amount, currency = 'INR', receipt, notes } = req.body;

      // === Validation ===
      // Check required fields
      const requiredFields = { amount, receipt, notes };
      const missingFields = Object.entries(requiredFields)
          .filter(([_, value]) => !value)
          .map(([key]) => key);

      if (missingFields.length > 0) {
          return res.status(400).json({
              error: "Missing required fields",
              missingFields
          });
      }

      // Validate amount (must be positive number)
      if (isNaN(amount) || amount <= 0) {
          return res.status(400).json({
              error: "Amount must be a positive number"
          });
      }

      // === Currency Conversion ===
      const amountInPaise = Math.round(amount * 100);
      if (amountInPaise < 100) { // Razorpay minimum amount
          return res.status(400).json({
              error: "Amount must be at least ₹1 (100 paise)"
          });
      }

      // === Order Creation ===
      const options = {
          amount: amountInPaise.toString(),
          currency,
          receipt,
          notes,
          payment_capture: 1
      };

      const order = await razorpayInstance.orders.create(options);

      // === Response ===
      res.status(201).json({ // 201 for resource creation
          success: true,
          order,
          key: process.env.RAZERPAY_API_KEY
      });

  } catch (error) {
      console.error('Razorpay Order Error:', error);

      // Handle Razorpay API errors specifically
      const errorMessage = error.error?.description || 
                          error.message || 
                          'Failed to create order';

      res.status(error.statusCode || 500).json({
          success: false,
          error: errorMessage
      });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    // ✅ Get data from request body
    const { orderId, paymentId, signature } = req.body;

    // ✅ Check if required fields are received
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }


    // ✅ Razorpay Secret Key from .env
   let key_secret=process.env.RAZERPAY_API_SECRET;
    if (!key_secret) {
      return res.status(500).json({ success: false, message: "Server error: Razorpay secret key not found" });
    }

    // ✅ Generate HMAC signature
    const hmac = crypto.createHmac("sha256", key_secret);
    hmac.update(orderId + "|" + paymentId);
    const generated_signature = hmac.digest("hex");

    // ✅ Compare the generated signature with the one from Razorpay
    if (generated_signature === signature) {
      return res.status(200).json({ success: true, message: "Payment has been verified" });
    } else {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

  } catch (error) {
    console.error("Payment Verification Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const Refund = async (req, res) => {
  try {
    const { payment_id, amount } = req.body;

    // Fetch payment details
    const payment = await razorpayInstance.payments.fetch(payment_id);
    if (!payment || !payment.amount) {
      return res.status(400).json({ success: false, message: "Invalid payment details or missing amount" });
    }

    console.log("Payment Details:", payment);

    // If custom refund amount provided
    const refundAmount = amount || payment.amount;

    if (refundAmount < 100) {
      return res.status(400).json({
        success: false,
        message: "The refund amount must be at least INR 1.00",
      });
    }

    // Proceed with refund
    const refund = await razorpayInstance.payments.refund(payment_id, { amount: refundAmount });

    res.json({
      success: true,
      message: "Refund initiated successfully!",
      refund,
    });

  } catch (error) {
    console.error("Razorpay Refund Error:", error);
    res.status(500).json({ success: false, message: error.error?.description || "Refund failed" });
  }
};


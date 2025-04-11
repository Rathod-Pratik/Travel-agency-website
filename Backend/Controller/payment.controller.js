import crypto from 'crypto';
import { razorpayInstance } from '../index.js';
import Razorpay from 'razorpay';

export const createOrder = async (req, res) => {
    try {
      const { amount, currency = 'INR', receipt, notes } = req.body;
  
      // Validate required fields
      if (!amount || !receipt || !notes) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Validate amount type
      if (isNaN(amount)) {
        return res.status(400).json({ error: "Amount must be a number" });
      }
  
      // Convert amount to paise (smallest currency unit)
      const amountInPaise = Math.round(amount * 100);
  
      // Create order options
      const options = {
        amount: amountInPaise.toString(),
        currency,
        receipt,
        notes,
        payment_capture: 1 // Auto-capture payment
      };
  
      // Create Razorpay order
      const order = await razorpayInstance.orders.create(options);
  
      res.status(200).json({
        success: true,
        order,
        key: process.env.RAZERPAY_API_KEY // Send key to frontend
      });
  
    } catch (error) {
      console.error('Razorpay Order Error:', error);
      res.status(500).json({
        success: false,
        error: error.error?.description || 'Failed to create order'
      });
    }
}

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

      // Proceed with refund
      const refund = await razorpayInstance.payments.refund(payment_id, { amount: amount || payment.amount });
      console.log("Refund Details:", refund);

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
